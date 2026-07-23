import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');
const trackingId = 'G-8MPE6XWC1E';

const analyticsSnippet = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${trackingId}');
    </script>`;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir(pagesDir, (filePath) => {
  if (filePath.endsWith('.astro')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the snippet is already present
    if (content.includes(trackingId)) {
      console.log(`Already has tracking: ${path.relative(pagesDir, filePath)}`);
      return;
    }

    // Insert the snippet right after <head>
    const headTag = '<head>';
    const headIndex = content.indexOf(headTag);
    
    if (headIndex !== -1) {
      const insertPosition = headIndex + headTag.length;
      const updatedContent = content.slice(0, insertPosition) + analyticsSnippet + content.slice(insertPosition);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Injected analytics into: ${path.relative(pagesDir, filePath)}`);
    } else {
      console.warn(`No <head> tag found in: ${path.relative(pagesDir, filePath)}`);
    }
  }
});
