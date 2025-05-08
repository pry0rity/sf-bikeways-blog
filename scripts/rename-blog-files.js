import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOG_DIR = path.join(path.dirname(__dirname), 'src/content/blog');

function formatDate(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function renameBlogFiles() {
    const files = fs.readdirSync(BLOG_DIR);
    
    files.forEach(file => {
        if (!file.endsWith('.md')) return;
        
        const filePath = path.join(BLOG_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(content);
        
        if (!data.date) {
            console.warn(`Warning: No date found in frontmatter for ${file}`);
            return;
        }
        
        const date = new Date(data.date);
        const datePrefix = formatDate(date);
        const title = data.title || path.parse(file).name;
        const newFileName = `${datePrefix}-${slugify(title)}.md`;
        
        if (file !== newFileName) {
            const newFilePath = path.join(BLOG_DIR, newFileName);
            
            // Check if file with new name already exists
            if (fs.existsSync(newFilePath)) {
                console.warn(`Warning: File ${newFileName} already exists. Skipping ${file}`);
                return;
            }
            
            fs.renameSync(filePath, newFilePath);
            console.log(`Renamed: ${file} -> ${newFileName}`);
        }
    });
}

renameBlogFiles(); 