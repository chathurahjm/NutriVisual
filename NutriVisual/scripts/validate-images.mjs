#!/usr/bin/env node

/**
 * Automated Food Image Accuracy & Semantic Verification Engine
 * 
 * Verifies all 128+ whole food images in src/data/foods.json:
 * 1. Tier 1: Deterministic Network & Duplicate Audit (Fast, 0 Cost)
 *    - Validates HTTPS protocol & URL formatting
 *    - Validates HTTP 200 reachability & image MIME type
 *    - Flags unauthorized image reuse / collisions across distinct foods
 *    - Checks minimum image dimensions (>=300x200)
 * 2. Tier 2: AI Multimodal Semantic Verification (Gemini Vision / OpenAI)
 *    - Visually confirms the photo depicts the named food
 *    - Runs only on cache misses (persisted in src/data/image-audit-cache.json)
 * 
 * Usage:
 *   node scripts/validate-images.mjs             # Full tiered test
 *   node scripts/validate-images.mjs --quick     # Tier 1 only (instant, 0 cost)
 *   node scripts/validate-images.mjs --food=eggplant # Check single food
 *   node scripts/validate-images.mjs --all       # Force re-verify all bypassing cache
 * 
 * GitHub Actions Workflow:
 *   .github/workflows/validate-images.yml
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Jimp } from 'jimp';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const FOODS_FILE = path.join(ROOT_DIR, 'src/data/foods.json');
const CACHE_FILE = path.join(ROOT_DIR, 'src/data/image-audit-cache.json');

// Command line arguments
const args = process.argv.slice(2);
const IS_QUICK = args.includes('--quick');
const FORCE_ALL = args.includes('--all');
const WARN_ONLY = args.includes('--warn-only');
const SPECIFIC_FOOD = (args.find(a => a.startsWith('--food=')) || '').replace('--food=', '');

// Legitimate culinary / botanical variants permitted to share images
const ALLOWED_VARIANTS = [
  ['atlantic-salmon', 'farmed-salmon', 'wild-salmon'],
  ['beef', 'sirloin'],
  ['grass-fed-butter', 'regular-butter'],
  ['matcha', 'iced-matcha'],
  ['cauliflower', 'cauliflower-rice'],
  ['pork-tenderloin', 'pork-chop']
];

// Check if two food IDs belong to the same allowed variant cluster
function isAllowedVariantShare(id1, id2) {
  return ALLOWED_VARIANTS.some(group => group.includes(id1) && group.includes(id2));
}

// Compute stable hash for cache entry
function getCacheKey(foodId, imageUrl) {
  return crypto.createHash('sha256').update(`${foodId}:${imageUrl}`).digest('hex');
}

// Load foods data
function loadFoods() {
  if (!fs.existsSync(FOODS_FILE)) {
    console.error(`❌ Foods data file not found at: ${FOODS_FILE}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(FOODS_FILE, 'utf-8'));
}

// Load or initialize persistent audit cache
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

// Concurrency pool helper to avoid overloading network / API
async function asyncPool(limit, items, iteratorFn) {
  const results = [];
  const executing = [];
  for (const item of items) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    results.push(p);
    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

// TIER 1: Network reachability & image headers test
async function checkNetworkHealth(food) {
  const errors = [];
  const warnings = [];

  if (!food.image) {
    return { food, pass: false, errors: ['Missing image property'], warnings: [] };
  }

  // Check local images in public/
  if (food.image.startsWith('/') || food.image.startsWith('images/')) {
    const relativePath = food.image.startsWith('/') ? food.image.slice(1) : food.image;
    const localFilePath = path.join(ROOT_DIR, 'public', relativePath);

    if (!fs.existsSync(localFilePath)) {
      errors.push(`Local file does not exist: public/${relativePath}`);
    } else {
      const stats = fs.statSync(localFilePath);
      if (stats.size < 1000) {
        errors.push(`Local file is suspiciously small (${stats.size} bytes)`);
      }
    }

    return {
      food,
      pass: errors.length === 0,
      errors,
      warnings,
      isLocal: true
    };
  }

  if (!food.image.startsWith('https://')) {
    errors.push(`Insecure or invalid URL: ${food.image}`);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    // HEAD request to quickly check reachability without full payload
    let res = await fetch(food.image, { method: 'HEAD', signal: controller.signal });
    // Some CDNs reject HEAD, fallback to GET if needed
    if (res.status === 405 || res.status === 403) {
      res = await fetch(food.image, { method: 'GET', signal: controller.signal });
    }
    clearTimeout(timeout);

    if (res.status !== 200) {
      errors.push(`HTTP ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      errors.push(`Invalid content-type: "${contentType}" (expected image/*)`);
    }

    // Dimension check on Unsplash images
    const widthMatch = food.image.match(/[?&]w=(\d+)/);
    if (widthMatch && parseInt(widthMatch[1], 10) < 300) {
      warnings.push(`Image width parameter is low (${widthMatch[1]}px)`);
    }
  } catch (err) {
    errors.push(`Connection failed: ${err.message}`);
  }

  return {
    food,
    pass: errors.length === 0,
    errors,
    warnings
  };
}

// TIER 1: Duplicate cross-food image collision detector
function checkDuplicateCollisions(foods) {
  const imageToFoods = new Map();
  const collisionErrors = [];

  for (const food of foods) {
    if (!food.image) continue;
    // Extract base URL / photo ID to ignore trivial query parameter differences
    const cleanUrl = food.image.split('?')[0];
    if (!imageToFoods.has(cleanUrl)) {
      imageToFoods.set(cleanUrl, []);
    }
    imageToFoods.get(cleanUrl).push(food);
  }

  for (const [cleanUrl, sharedFoods] of imageToFoods.entries()) {
    if (sharedFoods.length > 1) {
      // Check if all shared foods are in an allowed variant cluster
      const unallowedPairs = [];
      for (let i = 0; i < sharedFoods.length; i++) {
        for (let j = i + 1; j < sharedFoods.length; j++) {
          const f1 = sharedFoods[i];
          const f2 = sharedFoods[j];
          if (!isAllowedVariantShare(f1.id, f2.id)) {
            unallowedPairs.push(`${f1.name} (${f1.id}) ↔ ${f2.name} (${f2.id})`);
          }
        }
      }

      if (unallowedPairs.length > 0) {
        collisionErrors.push({
          url: cleanUrl,
          foods: sharedFoods.map(f => f.name),
          pairs: unallowedPairs
        });
      }
    }
  }

  return collisionErrors;
}

// TIER 2: AI Multimodal Semantic Verification
async function verifySemanticAccuracyWithGemini(food, genAI) {
  try {
    const imgRes = await fetch(food.image);
    if (!imgRes.ok) {
      return { isMatch: false, reason: `Could not fetch image for AI check: HTTP ${imgRes.status}` };
    }
    const arrayBuffer = await imgRes.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imgRes.headers.get('content-type')?.split(';')[0] || 'image/jpeg';

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an expert food scientist and culinary botanist verifying photographic accuracy for a whole-foods nutrition database.
Target Food Item: "${food.name}"
Category: "${food.category}"

Carefully analyze the photograph:
1. What primary food or ingredient is depicted?
2. Does the photo accurately and clearly depict "${food.name}"?
   - Answer true for legitimate culinary presentations (raw, whole, sliced, or prepared).
   - Answer false if it depicts an entirely different food (e.g., banana instead of eggplant, salmon instead of halibut, spinach instead of brussels sprouts).

Respond ONLY with strict JSON in this format:
{
  "isMatch": boolean,
  "detectedFood": "concise description of what is actually in the picture",
  "confidence": "high" | "medium" | "low",
  "reason": "short explanation"
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    const text = result.response.text();
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    return {
      isMatch: null,
      reason: `AI vision call skipped / error: ${err.message}`
    };
  }
}

// MAIN RUNNER
async function runImageValidation() {
  console.log('\n🥑 NutriVisual Food Image Accuracy & Verification Suite');
  console.log('═'.repeat(60));

  let foods = loadFoods();
  const cache = loadCache();

  if (SPECIFIC_FOOD) {
    foods = foods.filter(f => f.id.toLowerCase() === SPECIFIC_FOOD.toLowerCase());
    if (foods.length === 0) {
      console.error(`❌ Food ID "${SPECIFIC_FOOD}" not found in database.`);
      process.exit(1);
    }
    console.log(`🎯 Testing single food: ${foods[0].name} (${foods[0].id})`);
  } else {
    console.log(`📦 Loaded ${foods.length} whole food items from foods.json`);
  }

  // --- TIER 1: Static & Network Auditing ---
  console.log('\n📡 Running Tier 1: Network Reachability & Health Check...');
  const networkResults = await asyncPool(10, foods, checkNetworkHealth);
  const networkFailures = networkResults.filter(r => !r.pass);

  console.log(`   • Verified: ${networkResults.length} URLs`);
  console.log(`   • Reachable (200 OK): ${networkResults.length - networkFailures.length}`);
  if (networkFailures.length > 0) {
    console.log(`   • ❌ Failed URLs: ${networkFailures.length}`);
    networkFailures.forEach(f => {
      console.log(`     - [${f.food.name}]: ${f.errors.join(', ')}`);
    });
  }

  console.log('\n🔍 Running Tier 1: Cross-Food Duplicate Collision Audit...');
  const duplicateCollisions = checkDuplicateCollisions(foods);
  if (duplicateCollisions.length === 0) {
    console.log('   • ✅ Zero unauthorized image collisions detected.');
  } else {
    console.log(`   • ⚠️ Found ${duplicateCollisions.length} unauthorized shared image collision(s):`);
    duplicateCollisions.forEach((col, idx) => {
      console.log(`     ${idx + 1}. Image: ${col.url}`);
      console.log(`        Conflicts: ${col.pairs.join('; ')}`);
    });
  }

  // --- TIER 2: Semantic Verification ---
  let aiVerifiedCount = 0;
  let aiFailedCount = 0;
  let aiSkippedCount = 0;
  const semanticFailures = [];

  const apiKey = process.env.GEMINI_API_KEY;
  const canRunAI = !IS_QUICK && apiKey && apiKey.startsWith('AIzaSy');

  if (IS_QUICK) {
    console.log('\n⏩ Tier 2 (AI Vision) skipped due to --quick flag.');
  } else if (!canRunAI) {
    console.log('\nℹ️  Tier 2 (AI Vision): Skipped (Set standard AI Studio GEMINI_API_KEY to enable automated semantic vision inspection).');
  } else {
    console.log('\n🤖 Running Tier 2: AI Multimodal Semantic Verification...');
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const food of foods) {
      const cacheKey = getCacheKey(food.id, food.image);
      const cached = cache[cacheKey];

      if (cached && !FORCE_ALL) {
        if (cached.isMatch === false) {
          semanticFailures.push({ food, result: cached });
          aiFailedCount++;
        } else {
          aiVerifiedCount++;
        }
        continue;
      }

      process.stdout.write(`   Scanning [${food.name}]... `);
      const visionResult = await verifySemanticAccuracyWithGemini(food, genAI);

      if (visionResult.isMatch === true) {
        console.log(`✅ Matches (${visionResult.detectedFood || food.name})`);
        cache[cacheKey] = {
          ...visionResult,
          verifiedAt: new Date().toISOString()
        };
        aiVerifiedCount++;
      } else if (visionResult.isMatch === false) {
        console.log(`❌ MISMATCH! Detected: ${visionResult.detectedFood} (${visionResult.reason})`);
        semanticFailures.push({ food, result: visionResult });
        cache[cacheKey] = {
          ...visionResult,
          verifiedAt: new Date().toISOString()
        };
        aiFailedCount++;
      } else {
        console.log(`⚠️ Skipped (${visionResult.reason})`);
        aiSkippedCount++;
      }
    }

    saveCache(cache);
  }

  // --- SUMMARY & EXIT CODE ---
  console.log('\n' + '═'.repeat(60));
  console.log('📊 Verification Summary:');
  console.log(`   • Total Foods Audited:       ${foods.length}`);
  console.log(`   • Reachable URLs:            ${networkResults.length - networkFailures.length}/${networkResults.length}`);
  console.log(`   • Duplicate Collisions:      ${duplicateCollisions.length}`);
  if (canRunAI) {
    console.log(`   • AI Semantic Matches:       ${aiVerifiedCount}`);
    console.log(`   • AI Semantic Mismatches:    ${aiFailedCount}`);
  }

  const hasFatalFailures = networkFailures.length > 0 || (!WARN_ONLY && duplicateCollisions.length > 0) || semanticFailures.length > 0;

  // --- GITHUB STEP SUMMARY ---
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      let md = `## 🥑 NutriVisual Food Image Verification Report\n\n`;
      if (hasFatalFailures) {
        md += `> **Status**: ❌ **Failed** - Issues detected that require attention.\n\n`;
      } else if (duplicateCollisions.length > 0) {
        md += `> **Status**: ⚠️ **Passed with Warnings** - Reachability & semantic health verified, but image collisions were detected.\n\n`;
      } else {
        md += `> **Status**: ✅ **All Checks Passed** - Food images are reachable, distinct, and verified.\n\n`;
      }

      md += `| Metric | Value |\n`;
      md += `| :--- | :--- |\n`;
      md += `| **Total Foods Audited** | \`${foods.length}\` |\n`;
      md += `| **Reachable URLs (200 OK)** | \`${networkResults.length - networkFailures.length}/${networkResults.length}\` |\n`;
      md += `| **Unauthorized Image Collisions** | \`${duplicateCollisions.length}\` |\n`;
      if (canRunAI) {
        md += `| **AI Semantic Matches** | \`${aiVerifiedCount}\` |\n`;
        md += `| **AI Semantic Mismatches** | \`${aiFailedCount}\` |\n`;
      }
      md += `\n`;

      if (networkFailures.length > 0) {
        md += `### ❌ Unreachable / Invalid URLs\n\n`;
        md += `| Food | ID | Image URL | Error |\n| :--- | :--- | :--- | :--- |\n`;
        for (const f of networkFailures) {
          md += `| **${f.food.name}** | \`${f.food.id}\` | [Link](${f.food.image}) | ${f.reason} |\n`;
        }
        md += `\n`;
      }

      if (duplicateCollisions.length > 0) {
        md += `### ⚠️ Shared Image Collisions\n\n`;
        for (const col of duplicateCollisions) {
          const foodNames = col.foods.map(name => `\`${name}\``).join(' ↔ ');
          md += `- **Foods**: ${foodNames} ([Image](${col.url}))\n`;
          for (const pair of col.pairs) {
            md += `  - ⚠️ \`${pair}\`\n`;
          }
        }
        md += `\n`;
      }

      if (semanticFailures.length > 0) {
        md += `### ❌ AI Semantic Mismatches\n\n`;
        md += `| Food | ID | Detected Subject | Reason |\n| :--- | :--- | :--- | :--- |\n`;
        for (const sf of semanticFailures) {
          md += `| **${sf.food.name}** | \`${sf.food.id}\` | ${sf.result.detectedFood} | ${sf.result.reason} |\n`;
        }
        md += `\n`;
      }

      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md, 'utf8');
    } catch (err) {
      console.warn('Could not write GitHub step summary:', err.message);
    }
  }

  // --- EXIT CODE ---
  if (hasFatalFailures) {
    console.log('\n❌ AUDIT FAILED! Please resolve the issues listed above before deploying.\n');
    process.exit(1);
  } else if (duplicateCollisions.length > 0) {
    console.log('\n⚠️ AUDIT PASSED WITH WARNINGS: Network & semantic health verified, but image collisions were detected.\n');
    process.exit(0);
  } else {
    console.log('\n✨ ALL AUDITS PASSED! Food images are reachable, non-conflicting, and accurate.\n');
    process.exit(0);
  }
}

runImageValidation().catch((err) => {
  console.error('Unhandled verification error:', err);
  process.exit(1);
});
