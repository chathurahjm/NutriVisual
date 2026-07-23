import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const dir = '/Users/chathura/Documents/fin/NutriVisual/public/images';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

console.log(`Found ${files.length} PNG files in ${dir}.`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const baseName = path.basename(file, '.png');
  const targetPath = path.join(dir, `${baseName}.jpg`);

  try {
    const image = await Jimp.read(filePath);
    
    // Resize to max 600px width
    const targetWidth = 600;
    if (image.width > targetWidth) {
      image.resize({ w: targetWidth });
    }

    // Set quality for JPEG (Jimp v1 uses quality method on jpeg export, or we can just specify mime/quality during save/write if supported)
    // Wait, let's write using jimp format. In Jimp v1, writing to .jpg is handled by path extension, or we can use:
    // const buffer = await image.getBuffer('image/jpeg', { quality: 80 });
    // fs.writeFileSync(targetPath, buffer);
    // Let's do that to ensure quality is 80%!
    const buffer = await image.getBuffer('image/jpeg', { quality: 80 });
    fs.writeFileSync(targetPath, buffer);

    const statsBefore = fs.statSync(filePath);
    const statsAfter = fs.statSync(targetPath);
    const sizeBeforeKb = (statsBefore.size / 1024).toFixed(1);
    const sizeAfterKb = (statsAfter.size / 1024).toFixed(1);

    console.log(`Converted ${file}: ${image.width}x${image.height} | Size: ${sizeBeforeKb}KB -> ${sizeAfterKb}KB`);

    // Remove the old PNG file
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}

// Now let's update references in json files
const jsonFiles = [
  '/Users/chathura/Documents/fin/NutriVisual/src/data/foods.json',
  '/Users/chathura/Documents/fin/NutriVisual/src/data/foods_backup.json'
];

for (const jsonPath of jsonFiles) {
  if (fs.existsSync(jsonPath)) {
    let content = fs.readFileSync(jsonPath, 'utf8');
    // Replace all instances of /images/something.png with /images/something.jpg
    const originalContent = content;
    // We only replace PNGs that exist in the images folder
    // For simplicity, we can do a global replace of "/images/(.*)\.png" with "/images/$1.jpg"
    content = content.replace(/\/images\/([^"]+)\.png/g, '/images/$1.jpg');
    
    if (content !== originalContent) {
      fs.writeFileSync(jsonPath, content, 'utf8');
      console.log(`Updated image references in ${path.basename(jsonPath)}`);
    }
  }
}
