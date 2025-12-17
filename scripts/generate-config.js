const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '../content/posts');
const CONFIG_DIR = path.join(__dirname, '../config');
const OLD_CONFIG_PATH = path.join(__dirname, '../config.json');

// Posts per page for pagination
const POSTS_PER_PAGE = 20;

// Helper to normalize path separators to forward slashes (for URL usage)
const normalizePath = (p) => p.split(path.sep).join('/');

// Ensure config directory exists
function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const postsDir = path.join(CONFIG_DIR, 'posts');
    if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
    }
}

function generateConfig() {
    console.log('Scanning content...');
    ensureConfigDir();

    // Find all .md files in content/posts
    const files = glob.sync(`${CONTENT_DIR}/**/*.md`);

    const posts = [];
    const categories = new Set();
    const tags = new Set();

    files.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);
        const data = parsed.data;

        // Relative path from 'content/' folder for fetching
        const absoluteContentPath = path.join(__dirname, '../content');
        const relativePath = path.relative(absoluteContentPath, filePath);
        const postDirRelative = path.dirname(relativePath);
        const postDirAbsolute = path.dirname(filePath);

        // Basic Validation
        if (!data.title) {
            console.warn(`Skipping ${filePath}: No 'title' in frontmatter.`);
            return;
        }

        // Image Path Logic
        let imagePath = '';

        if (data.image) {
            if (data.image.startsWith('http')) {
                imagePath = data.image;
            } else {
                imagePath = `content/${normalizePath(path.join(postDirRelative, data.image))}`;
            }
        } else {
            let foundImage = null;
            let mediaDir = path.join(postDirAbsolute, 'images');
            if (fs.existsSync(mediaDir)) {
                const dirFiles = fs.readdirSync(mediaDir);
                const img = dirFiles.find(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
                if (img) foundImage = path.join(mediaDir, img);
            }
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

        // Extract slug from path
        const slug = normalizePath(postDirRelative).replace('posts/', '');

        const post = {
            id: data.id || Date.now().toString() + Math.random().toString(),
            title: data.title,
            slug: slug,
            summary: data.summary || (() => {
                if (!parsed.content) return '';
                const plainText = parsed.content
                    .replace(/^#+\s+/gm, '')
                    .replace(/!\[.*?\]\(.*?\)/g, '')
                    .replace(/\[.*?\]\(.*?\)/g, '$1')
                    .replace(/`{3}[\s\S]*?`{3}/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                return plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');
            })(),
            image: imagePath,
            author: data.author || 'Anonymous',
            date: data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown',
            dateRaw: data.date ? new Date(data.date).toISOString() : null,
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            path: normalizePath(relativePath)
        };

        posts.push(post);
        if (post.category !== 'Uncategorized') {
            categories.add(post.category);
        }
        post.tags.forEach(tag => tags.add(tag));
    });

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.dateRaw || 0) - new Date(a.dateRaw || 0));

    // Read existing old config to preserve static fields
    let currentConfig = {};
    if (fs.existsSync(OLD_CONFIG_PATH)) {
        currentConfig = JSON.parse(fs.readFileSync(OLD_CONFIG_PATH, 'utf8'));
    }

    // ========== 1. SITE.JSON ==========
    const siteConfig = {
        siteTitle: currentConfig.siteTitle || "EXPLog",
        logo: currentConfig.logo || "assets/logo.png",
        description: currentConfig.description || "A lightweight file-based CMS",
        author: currentConfig.author || "EXPVN",
        language: currentConfig.language || "vi",
        postsPerPage: POSTS_PER_PAGE
    };
    fs.writeFileSync(
        path.join(CONFIG_DIR, 'site.json'),
        JSON.stringify(siteConfig, null, 2)
    );
    console.log('Generated: config/site.json');

    // ========== 2. HERO.JSON ==========
    // Read existing hero config file if exists
    const heroConfigPath = path.join(CONFIG_DIR, 'hero.json');
    let existingHero = {};
    if (fs.existsSync(heroConfigPath)) {
        existingHero = JSON.parse(fs.readFileSync(heroConfigPath, 'utf8'));
    } else if (currentConfig.hero) {
        existingHero = currentConfig.hero;
    }

    // Scan banner directory for images
    const bannerDir = path.join(__dirname, '../assets/banner');
    let bannerImages = [];
    if (fs.existsSync(bannerDir)) {
        bannerImages = fs.readdirSync(bannerDir)
            .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
            .map(f => `assets/banner/${f}`);
    }

    // Build hero config - slides is the main source of images/links
    const heroConfig = {
        enabled: existingHero.enabled !== undefined ? existingHero.enabled : true,
        title: existingHero.title || "Welcome to EXPLog",
        category: existingHero.category || "Featured",
        author: existingHero.author || "Anonymous",
        date: existingHero.date || new Date().toLocaleDateString(),
        // Use existing slides or generate from banner images
        slides: existingHero.slides || bannerImages.map(img => ({
            image: img,
            link: "/"
        }))
    };

    fs.writeFileSync(
        heroConfigPath,
        JSON.stringify(heroConfig, null, 2)
    );
    console.log('Generated: config/hero.json');

    // ========== 3. HOME.JSON ==========
    const homeConfig = currentConfig.home || {
        categories: [],
        limit: 6
    };
    fs.writeFileSync(
        path.join(CONFIG_DIR, 'home.json'),
        JSON.stringify(homeConfig, null, 2)
    );
    console.log('Generated: config/home.json');

    // ========== 4. MENU.JSON ==========
    let menu = currentConfig.menu;
    if (!menu || menu.length === 0) {
        menu = Array.from(categories).map(cat => ({
            title: cat.toUpperCase(),
            path: `category/${cat}`
        }));
    }
    fs.writeFileSync(
        path.join(CONFIG_DIR, 'menu.json'),
        JSON.stringify(menu, null, 2)
    );
    console.log('Generated: config/menu.json');

    // ========== 5. CATEGORIES.JSON ==========
    const categoriesData = Array.from(categories).map(cat => ({
        name: cat,
        slug: cat.toLowerCase(),
        count: posts.filter(p => p.category === cat).length
    }));
    fs.writeFileSync(
        path.join(CONFIG_DIR, 'categories.json'),
        JSON.stringify(categoriesData, null, 2)
    );
    console.log('Generated: config/categories.json');

    // ========== 6. TAGS.JSON ==========
    const tagsData = Array.from(tags).map(tag => ({
        name: tag,
        slug: tag.toLowerCase(),
        count: posts.filter(p => p.tags.includes(tag)).length
    }));
    fs.writeFileSync(
        path.join(CONFIG_DIR, 'tags.json'),
        JSON.stringify(tagsData, null, 2)
    );
    console.log('Generated: config/tags.json');

    // ========== 7. POSTS-INDEX.JSON (lightweight) ==========
    const postsIndex = posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        date: p.date,
        category: p.category,
        image: p.image
    }));
    fs.writeFileSync(
        path.join(CONFIG_DIR, 'posts-index.json'),
        JSON.stringify(postsIndex, null, 2)
    );
    console.log('Generated: config/posts-index.json');

    // ========== 8. POSTS/PAGE-X.JSON (paginated full data) ==========
    const postsDir = path.join(CONFIG_DIR, 'posts');
    // Clear old post pages
    const oldFiles = fs.readdirSync(postsDir);
    oldFiles.forEach(f => fs.unlinkSync(path.join(postsDir, f)));

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    for (let page = 1; page <= totalPages; page++) {
        const startIdx = (page - 1) * POSTS_PER_PAGE;
        const endIdx = startIdx + POSTS_PER_PAGE;
        const pagePosts = posts.slice(startIdx, endIdx);

        const pageData = {
            page: page,
            totalPages: totalPages,
            totalPosts: posts.length,
            postsPerPage: POSTS_PER_PAGE,
            posts: pagePosts
        };

        fs.writeFileSync(
            path.join(postsDir, `page-${page}.json`),
            JSON.stringify(pageData, null, 2)
        );
        console.log(`Generated: config/posts/page-${page}.json (${pagePosts.length} posts)`);
    }

    // ========== 9. PAGINATION.JSON ==========
    const paginationConfig = {
        totalPosts: posts.length,
        totalPages: totalPages,
        postsPerPage: POSTS_PER_PAGE
    };
    fs.writeFileSync(
        path.join(CONFIG_DIR, 'pagination.json'),
        JSON.stringify(paginationConfig, null, 2)
    );
    console.log('Generated: config/pagination.json');

    // ========== 10. CATEGORIES/{CATEGORY}.JSON (category-specific posts) ==========
    const categoriesDir = path.join(CONFIG_DIR, 'categories');
    if (!fs.existsSync(categoriesDir)) {
        fs.mkdirSync(categoriesDir, { recursive: true });
    }
    // Clear old category files
    const oldCatFiles = fs.readdirSync(categoriesDir);
    oldCatFiles.forEach(f => fs.unlinkSync(path.join(categoriesDir, f)));

    Array.from(categories).forEach(cat => {
        const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
        const catPosts = posts.filter(p => p.category === cat);

        const catData = {
            category: cat,
            slug: catSlug,
            totalPosts: catPosts.length,
            posts: catPosts
        };

        fs.writeFileSync(
            path.join(categoriesDir, `${catSlug}.json`),
            JSON.stringify(catData, null, 2)
        );
        console.log(`Generated: config/categories/${catSlug}.json (${catPosts.length} posts)`);
    });

    console.log(`\n✅ Successfully generated config with ${posts.length} posts across ${totalPages} pages.`);
    console.log(`   Categories: ${categories.size}, Tags: ${tags.size}`);

    // ========== 11. SITEMAP.XML ==========
    generateSitemap(posts, categories);

    // ========== 12. ROBOTS.TXT ==========
    generateRobotsTxt();
}

// Generate sitemap.xml for SEO
function generateSitemap(posts, categories) {
    const BASE_URL = 'https://expvn.com';
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <!-- Homepage -->
    <url>
        <loc>${BASE_URL}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
`;

    // Add category pages
    Array.from(categories).forEach(cat => {
        const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
        sitemap += `
    <url>
        <loc>${BASE_URL}/category/${catSlug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    // Add individual posts
    posts.forEach(post => {
        const postDate = post.dateRaw ? post.dateRaw.split('T')[0] : today;
        const imageUrl = post.image ?
            (post.image.startsWith('http') ? post.image : `${BASE_URL}/${post.image}`) : '';

        sitemap += `
    <url>
        <loc>${BASE_URL}/posts/${post.slug}</loc>
        <lastmod>${postDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>${imageUrl ? `
        <image:image>
            <image:loc>${imageUrl}</image:loc>
            <image:title>${escapeXml(post.title)}</image:title>
        </image:image>` : ''}
    </url>`;
    });

    // Scan for static pages (Embedded/Standalone)
    const pagesDir = path.join(__dirname, '../content/pages');
    if (fs.existsSync(pagesDir)) {
        // Embedded pages
        const embeddedDir = path.join(pagesDir, 'Embedded');
        if (fs.existsSync(embeddedDir)) {
            fs.readdirSync(embeddedDir).forEach(pageName => {
                const pageDir = path.join(embeddedDir, pageName);
                if (fs.statSync(pageDir).isDirectory()) {
                    sitemap += `
    <url>
        <loc>${BASE_URL}/${pageName}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>`;
                }
            });
        }

        // Standalone pages
        const standaloneDir = path.join(pagesDir, 'Standalone');
        if (fs.existsSync(standaloneDir)) {
            fs.readdirSync(standaloneDir).forEach(pageName => {
                const pageDir = path.join(standaloneDir, pageName);
                if (fs.statSync(pageDir).isDirectory()) {
                    sitemap += `
    <url>
        <loc>${BASE_URL}/pages/${pageName}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>`;
                }
            });
        }
    }

    sitemap += `
</urlset>`;

    const sitemapPath = path.join(__dirname, '../sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Generated: sitemap.xml');
}

// Generate robots.txt
function generateRobotsTxt() {
    const BASE_URL = 'https://expvn.com';

    const robotsTxt = `# Robots.txt for ${BASE_URL}
# Generated automatically by EXPVN CMS

User-agent: *
Allow: /

# Disallow admin/config directories
Disallow: /config/
Disallow: /scripts/
Disallow: /node_modules/

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl delay (optional, be nice to bots)
Crawl-delay: 1
`;

    const robotsPath = path.join(__dirname, '../robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt);
    console.log('Generated: robots.txt');
}

// Escape special XML characters
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

generateConfig();

