const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '../content/posts');
const CONFIG_PATH = path.join(__dirname, '../config.json');

// Helper to normalize path separators to forward slashes (for URL usage)
const normalizePath = (p) => p.split(path.sep).join('/');

function generateConfig() {
    console.log('Scanning content...');

    // Find all .md files in content/posts
    const files = glob.sync(`${CONTENT_DIR}/**/*.md`);

    const posts = [];
    const categories = new Set();

    files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);
        const data = parsed.data;

        // Relative path from 'content/' folder for fetching
        const absoluteContentPath = path.join(__dirname, '../content');
        const relativePath = path.relative(absoluteContentPath, filePath); // posts/slug/index.md
        const postDirRelative = path.dirname(relativePath); // posts/slug
        const postDirAbsolute = path.dirname(filePath); // c:/.../content/posts/slug

        // Basic Validation
        if (!data.title) {
            console.warn(`Skipping ${filePath}: No 'title' in frontmatter.`);
            return;
        }

        // Image Path Logic
        let imagePath = 'assets/hero.png'; // Default fallback

        // 1. Check Frontmatter
        if (data.image) {
            if (data.image.startsWith('http')) {
                imagePath = data.image;
            } else {
                imagePath = `content/${normalizePath(path.join(postDirRelative, data.image))}`;
            }
        }
        // 2. Auto-discovery in images/ or attachments/
        else {
            let foundImage = null;

            // Check 'images'
            let mediaDir = path.join(postDirAbsolute, 'images');
            if (fs.existsSync(mediaDir)) {
                const dirFiles = fs.readdirSync(mediaDir);
                const img = dirFiles.find(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
                if (img) foundImage = path.join(mediaDir, img);
            }

            // Check 'attachments'
            if (!foundImage) {
                mediaDir = path.join(postDirAbsolute, 'attachments');
                if (fs.existsSync(mediaDir)) {
                    const dirFiles = fs.readdirSync(mediaDir);
                    const img = dirFiles.find(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
                    if (img) foundImage = path.join(mediaDir, img);
                }
            }

            if (foundImage) {
                const relativeImgPath = path.relative(absoluteContentPath, foundImage);
                imagePath = `content/${normalizePath(relativeImgPath)}`;
            }
        }

        const post = {
            id: data.id || Date.now().toString() + Math.random().toString(),
            title: data.title,
            summary: data.summary || (() => {
                // Auto-generate summary from content
                if (!parsed.content) return '';
                // Simple markdown strip: remove headers, images, etc.
                const plainText = parsed.content
                    .replace(/^#+\s+/gm, '') // Remove headers
                    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
                    .replace(/\[.*?\]\(.*?\)/g, '$1') // Remove links
                    .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
                    .replace(/\s+/g, ' ') // Collapse whitespace
                    .trim();
                return plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');
            })(),
            image: imagePath,
            author: data.author || 'Anonymous',
            authorImage: data.authorImage || 'assets/avatar.png',
            date: data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown',
            category: data.category || 'Uncategorized',
            path: normalizePath(relativePath)
        };

        posts.push(post);
        if (post.category !== 'Uncategorized') {
            categories.add(post.category);
        }
    });

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Read existing config to preserve static fields
    let currentConfig = {};
    if (fs.existsSync(CONFIG_PATH)) {
        currentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }

    // Default Home Config if missing
    const homeConfig = currentConfig.home || {
        categories: [],
        limit: 10
    };

    // Hero Slider Logic: Scan assets/banner
    const bannerDir = path.join(__dirname, '../assets/banner');
    let heroImages = [];
    if (fs.existsSync(bannerDir)) {
        heroImages = fs.readdirSync(bannerDir)
            .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
            .map(f => `assets/banner/${f}`);
    }

    // Preserve existing hero or use default
    const heroConfig = currentConfig.hero || {
        title: "Welcome to EXPLog",
        image: "assets/hero.png",
        category: "Featured",
        date: new Date().toLocaleDateString(),
        link: ""
    };

    // Attach slider images if found
    if (heroImages.length > 0) {
        heroConfig.images = heroImages;
        // Use first image as main fallback
        heroConfig.image = heroImages[0];
    }

    // Generate Menu (Uppercase)
    const menu = [
        ...Array.from(categories).map(cat => ({
            title: cat.toUpperCase(),
            path: `category/${cat}`
        }))
    ];

    const newConfig = {
        ...currentConfig,
        siteTitle: currentConfig.siteTitle || "EXPLog",
        logo: currentConfig.logo || "assets/logo.png",
        hero: heroConfig,
        home: homeConfig, // Preserve/Set Home Config
        posts: posts,
        menu: menu
    };

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
    console.log(`Successfully generated config with ${posts.length} posts and ${categories.size} categories.`);
}

generateConfig();
