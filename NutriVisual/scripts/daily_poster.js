import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Jimp } from 'jimp';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Predefined popular pairs for the campaign
const POPULAR_PAIRS = [
  ['avocado', 'olive-oil'],
  ['atlantic-salmon', 'chicken-breast'],
  ['walnuts', 'macadamia-nuts'],
  ['chia-seeds', 'flaxseed'],
  ['blueberries', 'dark-chocolate'],
  ['broccoli', 'spinach'],
  ['chicken-breast', 'beef'],
  ['tofu', 'tempeh'],
  ['matcha', 'spirulina'],
  ['garlic', 'turmeric'],
  ['avocado', 'macadamia-nuts'],
  ['atlantic-salmon', 'tuna'],
  ['kale', 'broccoli']
];

// Helper to load foods
function loadFoods() {
  const foodsPath = path.join(__dirname, '../src/data/foods.json');
  return JSON.parse(fs.readFileSync(foodsPath, 'utf-8'));
}

// Generate the side-by-side comparison image
async function generateSwapImage(food1, food2) {
  console.log(`🎨 Stitching images for: ${food1.name} vs ${food2.name}...`);

  // Create a dark template image (1200 x 630 - standard social sharing size)
  const width = 1200;
  const height = 630;
  const image = new Jimp({ width, height, color: 0x0f172aff }); // slate-900 background

  // Load food images (check local folder public/images first, otherwise fall back to unsplash url)
  const getFoodImage = async (food) => {
    // If the food.image already points to a local file
    if (food.image.startsWith('/images/') || food.image.startsWith('images/')) {
      const localPath = path.join(__dirname, '../public', food.image);
      if (fs.existsSync(localPath)) {
        console.log(`📍 Found configured local asset: ${localPath}`);
        return await Jimp.read(localPath);
      }
    }

    // Scan public/images directory for any file containing the food ID
    const imagesDir = path.join(__dirname, '../public/images');
    if (fs.existsSync(imagesDir)) {
      const dirFiles = fs.readdirSync(imagesDir);
      const matchedFile = dirFiles.find(f => {
        const nameWithoutExt = path.basename(f, path.extname(f)).toLowerCase();
        const searchId = food.id.toLowerCase().replace(/-/g, '');
        const cleanName = nameWithoutExt.replace(/[-_]/g, '');
        return cleanName.includes(searchId) || searchId.includes(cleanName);
      });

      if (matchedFile) {
        const matchedPath = path.join(imagesDir, matchedFile);
        console.log(`📍 Found matched local asset for ${food.id}: ${matchedPath}`);
        return await Jimp.read(matchedPath);
      }
    }

    // Fallback to remote URL
    if (food.image.startsWith('http')) {
      console.log(`🌐 Fetching remote asset: ${food.image}`);
      return await Jimp.read(food.image);
    }

    throw new Error(`No image found for food: ${food.id}`);
  };

  try {
    const img1 = await getFoodImage(food1);
    const img2 = await getFoodImage(food2);

    // Resize images to fit side-by-side (e.g. 480x480)
    img1.resize({ w: 480, h: 480 });
    img2.resize({ w: 480, h: 480 });

    // Composite side-by-side with padding
    // Left food: x = 80, y = 75
    // Right food: x = 640, y = 75
    image.composite(img1, 80, 75);
    image.composite(img2, 640, 75);

    // Write the output file
    const outputDir = path.join(__dirname, '../public/assets/social');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'last_swap_draft.png');
    await image.write(outputPath);
    console.log(`✅ Stitched image saved to: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('❌ Error generating stitched image:', error);
    throw error;
  }
}

// Helper to convert standard text to Unicode Math Sans-Serif Bold (renders bold on FB/LinkedIn)
function toBold(str) {
  return str.split('').map(char => {
    const code = char.charCodeAt(0);
    // Uppercase A-Z
    if (code >= 65 && code <= 90) {
      return String.fromCodePoint(0x1d5d4 + (code - 65));
    }
    // Lowercase a-z
    if (code >= 97 && code <= 122) {
      return String.fromCodePoint(0x1d5ee + (code - 97));
    }
    // Numbers 0-9
    if (code >= 48 && code <= 57) {
      return String.fromCodePoint(0x1d7ec + (code - 48));
    }
    return char;
  }).join('');
}

// Rule-based local template generator for post copy
async function generatePostCopy(food1, food2) {
  console.log(`📝 Generating local template copy for ${food1.name} vs ${food2.name}...`);

  const fbTemplates = [
    // Format 1: Longevity Swap (Standard)
    (f1, f2) => `🥗 ${toBold("Longevity Swap of the Day: " + f1.name + " vs. " + f2.name)} 🥗

Looking to optimize your diet? Making simple swaps can transform your energy! Let's compare:

🟢 ${toBold(f1.name)}: ${f1.calories} kcal | P: ${f1.macros.protein}g | C: ${f1.macros.carbs}g | F: ${f1.macros.fat}g
Benefits: ${f1.benefits.slice(0, 2).join(' & ')}

🔴 ${toBold(f2.name)}: ${f2.calories} kcal | P: ${f2.macros.protein}g | C: ${f2.macros.carbs}g | F: ${f2.macros.fat}g
Benefits: ${f2.benefits.slice(0, 2).join(' & ')}

Compare full macro breakdowns & portion guides:
👉 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=facebook&utm_medium=social`,

    // Format 2: Food Matchup (Standard)
    (f1, f2) => `⚖️ ${toBold("Food Matchup: " + f1.name + " vs. " + f2.name)} ⚖️

How do these nutrition powerhouses stack up side-by-side? 

• ${toBold(f1.name)} offers ${f1.calories} kcal per serving, packed with benefits like ${f1.benefits.join(', ')}.
• ${toBold(f2.name)} delivers ${f2.calories} kcal, supporting ${f2.benefits.join(', ')}.

Which one fits your goals today? Check out our dynamic visual swap engine to compare portion sizes:
👉 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=facebook&utm_medium=social`,

    // Format 3: Portion Math
    (f1, f2) => {
      const multiplier = Math.max(1, Math.round(f2.calories / f1.calories));
      return `🧮 ${toBold("Nutrition Math: " + f1.name + " vs. " + f2.name)} 🧮

Did you know? To get the same calories as a single standard portion of ${f2.name} (${f2.calories} kcal), you would need to eat about ${multiplier} servings of ${f1.name}!

🟢 ${toBold(f1.name)}: ${f1.calories} kcal per serving
🔴 ${toBold(f2.name)}: ${f2.calories} kcal per serving

Scale portions and visualize nutrition weight:
👉 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=facebook&utm_medium=social`;
    },

    // Format 4: Cellular Deep-Dive
    (f1, f2) => `🧬 ${toBold("Cellular Nutrition: " + f1.name + " vs. " + f2.name)} 🧬

Let's look past the calories and focus on how these foods support your longevity pathways at a cellular level!

🟢 ${toBold(f1.name)} helps with: ${f1.benefits.join(', ')}
🔴 ${toBold(f2.name)} helps with: ${f2.benefits.join(', ')}

Fuel your body with intention. Compare micronutrient profiles:
👉 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=facebook&utm_medium=social`,

    // Format 5: Myth Busters
    (f1, f2) => `🔍 ${toBold("Dietary Myth Busters: " + f1.name + " vs. " + f2.name)} 🔍

Outdated nutrition advice tells us to only count calories. But all calories are NOT created equal!

• ${toBold(f1.name)} is ${f1.calories} kcal but packed with value for ${f1.benefits[0]}.
• ${toBold(f2.name)} is ${f2.calories} kcal but delivers massive support for ${f2.benefits[0]}.

See how they compare visually:
👉 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=facebook&utm_medium=social`,

    // Format 6: Habit Swap
    (f1, f2) => `⚡ ${toBold("Simple Longevity Swap")} ⚡

Upgrading your health doesn't mean eating boring meals. Try this swap today:

Instead of over-consuming high-calorie options, try adding ${toBold(f1.name)} to support your ${f1.benefits[0].toLowerCase()}.

🟢 ${toBold(f1.name)}: ${f1.calories} kcal per 100g
🔴 ${toBold(f2.name)}: ${f2.calories} kcal per 100g

Start swapping smart:
👉 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=facebook&utm_medium=social`
  ];

  const liTemplates = [
    // Format 1: Longevity Swap (Standard)
    (f1, f2) => `⚖️ ${toBold("NutriVisual Longevity Swap: " + f1.name + " vs. " + f2.name)} ⚖️

Dietary decisions directly impact mitochondrial health, metabolic flexibility, and daily cognitive performance.

Let's analyze the nutrient profiles:

📈 ${toBold(f1.name)} (${f1.calories} kcal)
- Macros: Protein ${f1.macros.protein}g | Carbs ${f1.macros.carbs}g | Fat ${f1.macros.fat}g
- Functional Benefits: ${f1.benefits.join(', ')}

📉 ${toBold(f2.name)} (${f2.calories} kcal)
- Macros: Protein ${f2.macros.protein}g | Carbs ${f2.macros.carbs}g | Fat ${f2.macros.fat}g
- Functional Benefits: ${f2.benefits.join(', ')}

Deep-dive into cellular density metrics and portion scaling ratios:
🔗 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=linkedin&utm_medium=social`,

    // Format 2: Executive Health (Standard)
    (f1, f2) => `🧠 ${toBold("Executive Health: Optimizing Nutrition with " + f1.name + " vs. " + f2.name)} 🧠

High-performance leadership requires clean fuel. When structuring meals for sustained energy, compare these values:

💼 ${toBold(f1.name)}
- Calories: ${f1.calories} kcal
- Key Biomarkers: ${f1.benefits.slice(0, 2).join(' & ')}

💼 ${toBold(f2.name)}
- Calories: ${f2.calories} kcal
- Key Biomarkers: ${f2.benefits.slice(0, 2).join(' & ')}

Explore side-by-side data visualization and swap metrics:
🔗 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=linkedin&utm_medium=social`,

    // Format 3: Portion Math
    (f1, f2) => {
      const multiplier = Math.max(1, Math.round(f2.calories / f1.calories));
      return `🧮 ${toBold("Metabolic Efficiency: Portion Volume Ratios")} 🧮

When optimizing for satiety and calorie efficiency, portion math matters. 

Compare the energy densities:
- 1 portion of ${toBold(f2.name)}: ${f2.calories} kcal
- 1 portion of ${toBold(f1.name)}: ${f1.calories} kcal

You would need to consume ${multiplier}x the volume of ${f1.name} to match the caloric load of ${f2.name}.

Explore side-by-side data visualization:
🔗 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=linkedin&utm_medium=social`;
    },

    // Format 4: Cellular Deep-Dive
    (f1, f2) => `🧬 ${toBold("Biomarker Optimization: Cellular Pathways")} 🧬

Effective biohacking requires selecting foods that target specific functional pathways.

- ${toBold(f1.name)} targets: ${f1.benefits.join(' & ')}
- ${toBold(f2.name)} targets: ${f2.benefits.join(' & ')}

Maximize your biological longevity. Compare the clean datasets:
🔗 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=linkedin&utm_medium=social`,

    // Format 5: Myth Busters
    (f1, f2) => `🔍 ${toBold("Deconstructing Nutritional Dogma")} 🔍

Simplistic caloric models fail to capture systemic impact. A macro-only view neglects micronutrient density.

- ${toBold(f1.name)} (${f1.calories} kcal) targets: ${f1.benefits.slice(0, 2).join(', ')}
- ${toBold(f2.name)} (${f2.calories} kcal) targets: ${f2.benefits.slice(0, 2).join(', ')}

Review the data-driven comparison:
🔗 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=linkedin&utm_medium=social`,

    // Format 6: Habit Swap
    (f1, f2) => `⚡ ${toBold("Micro-Habit Upgrades for Executive Longevity")} ⚡

Small, compounding changes in nutrition yield outsized gains in daily cognitive output.

Consider swapping or balancing:
- ${toBold(f1.name)}: Targets ${f1.benefits[0]}
- ${toBold(f2.name)}: Targets ${f2.benefits[0]}

Analyze the portion weight ratios:
🔗 https://nutrivisual.com/swap/${f1.id}-vs-${f2.id}/?utm_source=linkedin&utm_medium=social`
  ];

  // Select a template index randomly
  const templateIndex = Math.floor(Math.random() * fbTemplates.length);

  return {
    facebook: fbTemplates[templateIndex](food1, food2),
    linkedin: liTemplates[templateIndex](food1, food2)
  };
}

// Auto-publish to Facebook
async function publishToFacebook(text, imagePath) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !pageAccessToken) {
    console.log('⚠️ Facebook credentials not configured. Skipping active publishing.');
    return;
  }

  console.log('🚀 Uploading and publishing to Facebook Page...');

  try {
    const form = new FormData();
    const fileBlob = new Blob([fs.readFileSync(imagePath)], { type: 'image/png' });
    form.append('source', fileBlob, path.basename(imagePath));
    form.append('message', text);
    form.append('access_token', pageAccessToken);

    const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    if (result.error) {
      console.error('❌ Facebook API Error:', result.error);
    } else {
      console.log(`✅ Posted successfully to Facebook! Post ID: ${result.post_id || result.id}`);
    }
  } catch (err) {
    console.error('❌ Failed posting to Facebook:', err);
  }
}

// Auto-publish to LinkedIn
async function publishToLinkedIn(text, imagePath) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID; // Or personal URN

  if (!accessToken || !orgId) {
    console.log('⚠️ LinkedIn credentials not configured. Skipping active publishing.');
    return;
  }

  console.log('🚀 Publishing to LinkedIn...');
  // Note: LinkedIn API requires registering upload, PUTting the image, and then creating the share post.
  // We'll output the steps. Since this runs on auto-pilot, we provide the full implementation:
  try {
    // Step 1: Register an image upload
    const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: `urn:li:organization:${orgId}`,
          supportedUploadMechanisms: ['SYNCHRONOUS_UPLOAD']
        }
      })
    });

    const registerData = await registerResponse.json();
    const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadMechanism'].uploadUrl;
    const assetUrn = registerData.value.asset;

    // Step 2: Upload the binary image via PUT
    const fileBuffer = fs.readFileSync(imagePath);
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'image/png'
      },
      body: fileBuffer
    });

    // Step 3: Create the UGC Share Post linking the uploaded asset
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: `urn:li:organization:${orgId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text },
            shareMediaCategory: 'IMAGE',
            media: [{
              status: 'READY',
              description: { text: 'NutriVisual Swap of the Day' },
              media: assetUrn,
              title: { text: 'NutriVisual Swap' }
            }]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });

    if (postResponse.status === 201) {
      console.log('✅ Posted successfully to LinkedIn!');
    } else {
      const errBody = await postResponse.text();
      console.error('❌ LinkedIn API Error:', errBody);
    }
  } catch (err) {
    console.error('❌ Failed posting to LinkedIn:', err);
  }
}

// Main execution function
async function run() {
  const isDryRun = process.argv.includes('--dry-run');
  if (isDryRun) {
    console.log('⚙️ Running in DRY-RUN mode. No active publishing will occur.');
  }

  const foods = loadFoods();

  // Select a random popular pair
  const randomIndex = Math.floor(Math.random() * POPULAR_PAIRS.length);
  const [id1, id2] = POPULAR_PAIRS[randomIndex];

  const food1 = foods.find(f => f.id === id1);
  const food2 = foods.find(f => f.id === id2);

  if (!food1 || !food2) {
    console.error(`❌ Food items not found: ${id1} or ${id2}`);
    process.exit(1);
  }

  console.log(`🎯 Selected pair: ${food1.name} vs ${food2.name}`);

  try {
    // 1. Generate stitched image
    const imagePath = await generateSwapImage(food1, food2);

    // 2. Generate copy
    const copy = await generatePostCopy(food1, food2);
    console.log('\n--- Generated Post Copy ---');
    console.log(`[LINKEDIN]:\n${copy.linkedin}\n`);
    console.log(`[FACEBOOK]:\n${copy.facebook}\n---------------------------\n`);

    if (!isDryRun) {
      // 3. Publish to Facebook
      await publishToFacebook(copy.facebook, imagePath);
      // 4. Publish to LinkedIn
      await publishToLinkedIn(copy.linkedin, imagePath);
    }
  } catch (err) {
    console.error('❌ Automation script failed:', err);
    process.exit(1);
  }
}

run();
