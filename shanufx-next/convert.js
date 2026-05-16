const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dirToProcess = path.join(__dirname, 'public');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else {
      if (/\.(jpg|jpeg|png)$/i.test(file)) {
        if (file.includes('favicon') || file.includes('apple-touch-icon')) {
          console.log('Skipping favicon/icon:', file);
          continue;
        }
        
        const ext = path.extname(fullPath);
        const newPath = fullPath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
        
        console.log(`Converting ${fullPath} to .webp`);
        sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(newPath)
          .then(() => {
            console.log(`Successfully converted ${file}`);
            // Let's delete the original to keep things clean and avoid duplicates
            fs.unlinkSync(fullPath);
          })
          .catch(err => {
            console.error(`Error converting ${file}:`, err);
          });
      }
    }
  }
}

processDir(dirToProcess);
