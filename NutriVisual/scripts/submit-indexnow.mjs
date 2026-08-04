import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'nutrivisual.com';
const KEY = 'e8f49a37c10b42d5930e1687f23a94cd';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Priority URLs to index
const urls = [
  `https://${HOST}/`,
  `https://${HOST}/swap/garlic-vs-turmeric/`,
  `https://${HOST}/swap/red-beets-vs-spinach/`,
  `https://${HOST}/swap/avocado-vs-macadamia-nuts/`,
  `https://${HOST}/swap/atlantic-salmon-vs-tuna/`,
  `https://${HOST}/swap/kale-vs-broccoli/`,
  `https://${HOST}/swap/grass-fed-butter-vs-regular-butter/`,
  `https://${HOST}/swap/ribeye-vs-sirloin/`,
  `https://${HOST}/swap/wild-salmon-vs-farmed-salmon/`,
  `https://${HOST}/swap/white-rice-vs-cauliflower-rice/`,
  `https://${HOST}/swap/avocado-oil-vs-olive-oil/`,
  `https://${HOST}/swap/spinach-vs-beef-liver/`
];

async function submitIndexNow() {
  console.log(`🚀 Submitting ${urls.length} URLs to IndexNow for ${HOST}...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Sending to ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 200 || res.status === 202) {
        console.log(`✅ IndexNow submission to ${endpoint} succeeded (${res.status})`);
      } else {
        const text = await res.text();
        console.log(`⚠️ IndexNow submission to ${endpoint} returned HTTP ${res.status}: ${text}`);
      }
    } catch (err) {
      console.error(`❌ Failed to submit to ${endpoint}:`, err.message);
    }
  }
}

submitIndexNow();
