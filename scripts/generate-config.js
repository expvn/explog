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
        let imagePath = ''; // No default fallback

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
            // authorImage removed as requested
            date: data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown',
            category: data.category || 'Uncategorized',

            tags: data.tags || [],
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
        enabled: true,
        title: "Welcome to EXPLog",
        image: "",
        category: "Featured",
        date: new Date().toLocaleDateString(),
        link: ""
    };

    // Attach slider images if found
    if (heroImages.length > 0) {
        heroConfig.images = heroImages.map(img => img.startsWith('http') ? img : '/' + img);
        // Use first image as main fallback
        heroConfig.image = heroConfig.images[0];
    }

    // Ensure hero.image has leading slash
    if (heroConfig.image && !heroConfig.image.startsWith('http') && !heroConfig.image.startsWith('/')) {
        heroConfig.image = '/' + heroConfig.image;
    }

    // Remove stale authorImage if present
    delete heroConfig.authorImage;

    // Preserve enabled flag if it exists
    if (currentConfig.hero && typeof currentConfig.hero.enabled !== 'undefined') {
        heroConfig.enabled = currentConfig.hero.enabled;
    }

    // Generate Menu (Use existing or default if empty)
    let menu = currentConfig.menu;
    if (!menu || menu.length === 0) {
        menu = [
            ...Array.from(categories).map(cat => ({
                title: cat.toUpperCase(),
                path: `category/${cat}`
            }))
        ];
    }

    // Ensure menu paths have leading slash
    menu = menu.map(item => ({
        ...item,
        path: item.path.startsWith('/') ? item.path.slice(1) : item.path // Normalize to NO leading slash for config, handled in app
        // Actually, let's stick to what app.js expects.
        // APP EXPECTS: <a href="/${item.path}">
        // So item.path should NOT have a leading slash if we use the template `/${item.path}`.
        // Wait, if item.path is `category/blog`, then href is `/category/blog`. This is correct.
        // If item.path is `/category/blog`, then href is `//category/blog`.
        // So let's ensure they DO NOT have a leading slash.
    }));

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
