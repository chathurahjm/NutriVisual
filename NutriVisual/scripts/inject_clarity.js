import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clarityTag = 'y14bl1l18k';

const astroClaritySnippet = `
    <!-- Microsoft Clarity -->
    <script is:inline type="text/javascript">
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityTag}");
    </script>`;

const htmlClaritySnippet = `
    <!-- Microsoft Clarity -->
    <script type="text/javascript">
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityTag}");
    </script>`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(clarityTag)) {
    console.log(`Already has Clarity: ${filePath}`);
    return;
  }

  const snippet = filePath.endsWith('.astro') ? astroClaritySnippet : htmlClaritySnippet;

  // Insert after Google tag config script if present, or after <head>
  if (content.includes('gtag(\'config\'')) {
    const target = '</script>';
    const idx = content.indexOf(target, content.indexOf('gtag(\'config\''));
    if (idx !== -1) {
      const insertPos = idx + target.length;
      content = content.slice(0, insertPos) + snippet + content.slice(insertPos);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Injected Clarity after gtag in: ${filePath}`);
      return;
    }
  }

  const headTag = '<head>';
  const headIndex = content.indexOf(headTag);
  if (headIndex !== -1) {
    const insertPos = headIndex + headTag.length;
    content = content.slice(0, insertPos) + snippet + content.slice(insertPos);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected Clarity after <head> in: ${filePath}`);
  } else {
    console.warn(`No <head> tag found in: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath);
    } else if (filePathMatches(dirPath)) {
      processFile(dirPath);
    }
  });
}

function filePathMatches(p) {
  return p.endsWith('.astro') || p.endsWith('.html');
}

walkDir(path.join(__dirname, '../src/pages'));
walkDir(path.join(__dirname, '../public'));
