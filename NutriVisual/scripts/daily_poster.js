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
    // Check if there is a local file in public/images/
    const localName = `${food.id}.png`;
    const altLocalName = food.image.split('/').pop().split('?')[0];
    
    const possiblePaths = [
      path.join(__dirname, '../public/images', localName),
      path.join(__dirname, '../public/images', altLocalName),
      path.join(__dirname, '../public/images', `${food.id.replace(/-/g, '_')}.png`)
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        console.log(`📍 Found local asset: ${p}`);
        return await Jimp.read(p);
      }
    }

    console.log(`🌐 Fetching remote asset: ${food.image}`);
    try {
      return await Jimp.read(food.image);
    } catch (err) {
      console.warn(`⚠️ Could not fetch remote asset for ${food.name} (${err.message}). Generating fallback image tile...`);
      return new Jimp({ width: 480, height: 480, color: 0x1e293bff });
    }
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

// Call Gemini API to write social post copy
async function generatePostCopy(food1, food2) {
  console.log(`🤖 Calling Gemini API to write copy for ${food1.name} vs ${food2.name}...`);
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('⚠️ No GEMINI_API_KEY found. Using local template copy.');
    return {
      facebook: `🥗 NutriVisual Swap of the Day: ${food1.name} vs ${food2.name}!\n\nCompare side-by-side macro ratios, calories, and longevity benefits at: https://nutrivisual.com/swap/${food1.id}-vs-${food2.id}/?utm_source=facebook&utm_medium=social`,
      linkedin: `⚖️ NutriVisual Longevity Swap: ${food1.name} vs ${food2.name}.\n\nDeep-dive into cellular nutrition and cognitive optimization: https://nutrivisual.com/swap/${food1.id}-vs-${food2.id}/?utm_source=linkedin&utm_medium=social`
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
You are a top health copywriter for NutriVisual, a data-driven nutrition platform.
Write two short social media posts comparing ${food1.name} and ${food2.name} as a "Longevity Swap".

Food #1 (${food1.name}):
- Calories: ${food1.calories} kcal
- Macros: Protein ${food1.macros.protein}g, Carbs ${food1.macros.carbs}g, Fat ${food1.macros.fat}g
- Key Benefits: ${food1.benefits.join(', ')}

Food #2 (${food2.name}):
- Calories: ${food2.calories} kcal
- Macros: Protein ${food2.macros.protein}g, Carbs ${food2.macros.carbs}g, Fat ${food2.macros.fat}g
- Key Benefits: ${food2.benefits.join(', ')}

The swap URL is: https://nutrivisual.com/swap/${food1.id}-vs-${food2.id}/

Instructions:
1. "LinkedIn Post": Write in a professional, performance-driven tone. Target entrepreneurs, executives, and biohackers. Explain the impact on cognitive energy, metabolism, and cellular longevity. Include the swap URL with "?utm_source=linkedin&utm_medium=social" at the end. Keep it under 150 words.
2. "Facebook Post": Write in a warm, engaging, lifestyle-oriented tone. Target families, everyday health enthusiasts, and cooking fans. Explain why making this simple food swap is a win for longevity. Include the swap URL with "?utm_source=facebook&utm_medium=social" at the end. Keep it under 120 words.

Format your output exactly as a JSON object with keys "linkedin" and "facebook". Do not output any markdown code blocks, just raw JSON.
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    // Parse JSON safely
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (error) {
    console.error('❌ Gemini generation failed:', error);
    return {
      facebook: `🥗 NutriVisual Swap of the Day: ${food1.name} vs ${food2.name}!\n\nCompare side-by-side macro ratios, calories, and longevity benefits at: https://nutrivisual.com/swap/${food1.id}-vs-${food2.id}/?utm_source=facebook&utm_medium=social`,
      linkedin: `⚖️ NutriVisual Longevity Swap: ${food1.name} vs ${food2.name}.\n\nDeep-dive into cellular nutrition and cognitive optimization: https://nutrivisual.com/swap/${food1.id}-vs-${food2.id}/?utm_source=linkedin&utm_medium=social`
    };
  }
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
  // Note: Standard multipart form-data upload for local files
  // In a real serverless or Actions runner, we use fetch with FormData
  // To keep dependencies clean, we use a simple fetch script
  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('source', fs.createReadStream(imagePath));
  form.append('message', text);
  form.append('access_token', pageAccessToken);

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
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
  const isFbOnly = process.argv.includes('--fb-only') || process.argv.includes('--facebook-only');

  if (isDryRun) {
    console.log('⚙️ Running in DRY-RUN mode. No active publishing will occur.');
  }
  if (isFbOnly) {
    console.log('🎯 Target platform: Facebook ONLY.');
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

      // 4. Publish to LinkedIn (skipped if FB-only)
      if (!isFbOnly) {
        await publishToLinkedIn(copy.linkedin, imagePath);
      } else {
        console.log('ℹ️ Skipped LinkedIn publishing (--fb-only mode active).');
      }
    }
  } catch (err) {
    console.error('❌ Automation script failed:', err);
    process.exit(1);
  }
}

run();
