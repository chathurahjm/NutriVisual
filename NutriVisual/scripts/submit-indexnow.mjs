import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'nutrivisual.com';
const KEY = 'e8f49a37c10b42d5930e1687f23a94cd';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Helper to recursively collect all HTML pages from build output
function collectUrls(dir, baseDir = DIST_DIR) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(collectUrls(filePath, baseDir));
    } else if (file === 'index.html') {
      const relativePath = path.relative(baseDir, filePath);
      let urlPath = relativePath.replace(/\\/g, '/').replace(/index\.html$/, '');
      if (urlPath && !urlPath.endsWith('/')) {
        urlPath += '/';
      }
      results.push(`https://${HOST}/${urlPath}`);
    }
  }
  return results;
}

async function submitIndexNow() {
  let urls = collectUrls(DIST_DIR);

  // Fallback to core URLs if dist is empty
  if (urls.length === 0) {
    urls = [
      `https://${HOST}/`,
      `https://${HOST}/swap/`,
      `https://${HOST}/blog/`,
      `https://${HOST}/swap/avocado-vs-chia-seeds/`,
      `https://${HOST}/swap/avocado-oil-vs-olive-oil/`,
      `https://${HOST}/swap/macadamia-nuts-vs-olive-oil/`,
      `https://${HOST}/swap/flaxseed-vs-olive-oil/`,
      `https://${HOST}/swap/avocado-vs-walnuts/`,
      `https://${HOST}/swap/greek-yogurt-vs-tofu/`
    ];
  }

  // Deduplicate URLs
  urls = Array.from(new Set(urls));

  console.log(`🚀 Instant IndexNow Submission for ${HOST}`);
  console.log(`📌 Found ${urls.length} total URLs to index across nutrivisual.com\n`);

  const endpoints = [
    { name: 'IndexNow Central API', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing (Microsoft Copilot)', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex', url: 'https://yandex.com/indexnow' },
    { name: 'Naver Search Engine', url: 'https://search.naver.com/indexnow' },
    { name: 'Seznam.cz', url: 'https://seznam.cz/indexnow' }
  ];

  // IndexNow batch limit is 10,000 URLs per request
  const BATCH_SIZE = 10000;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch
    };

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok || res.status === 200 || res.status === 202) {
          console.log(`  ✅ [${ep.name}] Indexing submission succeeded (HTTP ${res.status})`);
        } else {
          const text = await res.text();
          console.log(`  ⚠️ [${ep.name}] Returned HTTP ${res.status}: ${text}`);
        }
      } catch (err) {
        console.error(`  ❌ [${ep.name}] Failed: ${err.message}`);
      }
    }
  }

  console.log('\n✨ Instant IndexNow Submission Complete!');
}

submitIndexNow();
