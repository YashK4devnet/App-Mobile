import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace backtick URLs: `https://erp.eduquity.com/path` -> `${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}/path`
  content = content.replace(/`https:\/\/erp\.eduquity\.com\/?([^`]*)`/g, "`${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}/$1`");

  // Replace standard string URLs: "https://erp.eduquity.com/path" -> `${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}/path`
  content = content.replace(/"https:\/\/erp\.eduquity\.com\/?([^"]*)"/g, "`${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}/$1`");
  
  // Replace single quote URLs: 'https://erp.eduquity.com/path' -> `${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}/path`
  content = content.replace(/'https:\/\/erp\.eduquity\.com\/?([^']*)'/g, "`${import.meta.env.VITE_API_BASE_URL || 'https://erp.eduquity.com'}/$1`");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log(`Updated ${changedCount} files.`);
