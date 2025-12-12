const appState = {
    config: null,
    currentPath: null
};

const els = {
    app: document.getElementById('app'),
    homeView: document.getElementById('home-view'),
    articleView: document.getElementById('article-view'),
    heroSection: document.getElementById('hero-section'),
    blogGrid: document.getElementById('blog-grid'),
    markdownContent: document.getElementById('markdown-content'),
    sectionHeader: document.querySelector('.section-header h2')
};

async function init() {
    try {
        await loadConfig();
        setupRouting();
        handleRoute();
    } catch (error) {
        console.error(error);
        alert("Failed to load application");
    }
}

async function loadConfig() {
    const res = await fetch('config.json');
    appState.config = await res.json();
    renderNavBar();
}

function renderNavBar() {
    const { menu } = appState.config;
    // We only update the links container
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    navLinks.innerHTML = menu.map(item => `
        <a href="#/${item.path}" class="nav-link">${item.title}</a>
    `).join('');
}

function renderHome(categoryFilter = null) {
    const { hero, posts, home } = appState.config;

    // Filter Logic
    let displayPosts = [...posts]; // Copy array
    let isHome = categoryFilter === null;

    if (isHome) {
        // HOME PAGE LOGIC
        els.sectionHeader.textContent = 'News'; // Renamed from "Featured blog posts" to "News"
        els.heroSection.classList.remove('hidden');
        renderHero(hero);

        // 1. Filter by Home Config Categories (if defined and not empty)
        if (home && home.categories && home.categories.length > 0) {
            displayPosts = displayPosts.filter(p => home.categories.includes(p.category));
        }

        // 2. Limit number of posts
        if (home && home.limit) {
            displayPosts = displayPosts.slice(0, home.limit);
        }

    } else {
        // CATEGORY PAGE LOGIC
        // Filter by specific category
        displayPosts = displayPosts.filter(p => p.category === categoryFilter);
        els.sectionHeader.textContent = `${categoryFilter.replace(/^./, c => c.toUpperCase())} Posts`; // Title Case for display

        // Hide hero on category pages
        els.heroSection.classList.add('hidden');
    }

    // Render Grid
    if (displayPosts.length === 0) {
        els.blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No posts found.</p>';
        return;
    }

    els.blogGrid.innerHTML = displayPosts.map(post => `
        <a href="#/${post.path}" class="post-card">
            <div class="card-image-wrapper">
                <img src="${post.image}" alt="${post.title}" class="card-image" onerror="this.src='assets/hero.png'">
            </div>
            <div class="post-content">
                <div class="post-meta-top" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">
                    <span class="post-category" style="color: var(--primary); text-transform: uppercase;">${post.category}</span>
                    <span class="meta-date">${post.date}</span>
                </div>
                <h3 class="post-title">
                    ${post.title}
                    <ion-icon name="arrow-up-outline" class="arrow-icon" style="transform: rotate(45deg)"></ion-icon>
                </h3>
                <p class="post-summary">${post.summary || 'Click to read!'}</p>
            </div>
        </a>
    `).join('');
}

let sliderInterval;

function renderHero(hero) {
    if (!hero) return;

    // Normalize images to slides array: [{image, link}]
    let slides = [];
    if (hero.slides && hero.slides.length > 0) {
        slides = hero.slides;
    } else if (hero.images && hero.images.length > 0) {
        // Fallback for string array (from auto-scan)
        slides = hero.images.map(img => ({ image: img, link: hero.link || '#' }));
    } else {
        // Single image fallback
        slides = [{ image: hero.image, link: hero.link || '#' }];
    }

    const isSlider = slides.length > 1;

    let slidesHtml = slides.map((slide, index) => `
        <a href="${slide.link}" class="hero-slide ${index === 0 ? 'active' : ''}" style="display: ${index === 0 ? 'block' : 'none'}; width: 100%; height: 100%; position: absolute; top:0; left:0; transition: opacity 0.5s ease;">
            <img src="${slide.image}" alt="Hero ${index}" style="width: 100%; height: 100%; object-fit: cover;">
        </a>
    `).join('');

    let controlsHtml = '';
    if (isSlider) {
        controlsHtml = `
            <button class="slider-btn prev-btn" onclick="changeSlide(-1)">
                <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <button class="slider-btn next-btn" onclick="changeSlide(1)">
                <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
            <div class="slider-dots">
                ${slides.map((_, index) => `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>`).join('')}
            </div>
        `;
    }

    els.heroSection.innerHTML = `
        <div class="container">
             <div class="hero-image-wrapper" id="hero-slider" onmouseenter="pauseSlider()" onmouseleave="startSlider()">
                ${slidesHtml}
                ${controlsHtml}
             </div>
        </div>
    `;

    if (isSlider) {
        window.currentSlide = 0;
        window.totalSlides = slides.length;
        startSlider();
    }
}

// Global Slider Functions (attached to window for HTML onclick access)
window.changeSlide = function (dir) {
    showSlide(window.currentSlide + dir);
};

window.goToSlide = function (index) {
    showSlide(index);
};

function showSlide(index) {
    if (index >= window.totalSlides) index = 0;
    if (index < 0) index = window.totalSlides - 1;

    window.currentSlide = index;

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');

    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });

    dots.forEach((dot, i) => {
        if (i === index) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

window.startSlider = function () {
    // Clear existing to avoid duplicates
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        window.changeSlide(1);
    }, 5000); // 5 seconds interval
};

window.pauseSlider = function () {
    if (sliderInterval) clearInterval(sliderInterval);
};

function setupRouting() {
    window.addEventListener('hashchange', handleRoute);
}

async function handleRoute() {
    let hash = window.location.hash.slice(2); // Remove '#/'

    // Normalize hash
    // "" -> Home
    // "category/Design" -> Category Filter
    // "posts/slug/post.md" -> Article

    if (!hash) {
        showHome();
        renderHome(null); // All posts
    } else if (hash.startsWith('category/')) {
        const category = decodeURIComponent(hash.split('/')[1]);
        showHome();
        renderHome(category);
    } else {
        showArticle();
        await loadContent(hash);
    }
}

function showHome() {
    els.homeView.classList.remove('hidden');
    els.articleView.classList.add('hidden');
    window.scrollTo(0, 0);
}

function showArticle() {
    els.homeView.classList.add('hidden');
    els.articleView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

async function loadContent(path) {
    els.markdownContent.innerHTML = '<div class="loading">Loading...</div>';

    // Find Post Metadata & Index from Config
    const posts = appState.config.posts;
    const postIndex = posts.findIndex(p => p.path === path);
    const post = posts[postIndex];

    if (!post) {
        els.markdownContent.innerHTML = `
            <div style="text-align:center; padding: 4rem;">
                <h1>Post Not Found</h1>
                <p>Path: ${path}</p>
            </div>`;
        return;
    }

    // Prev/Next Logic
    const nextPost = postIndex > 0 ? posts[postIndex - 1] : null; // Newer
    const prevPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null; // Older

    // Related Posts Logic (Same Category, Exclude Current, Limit 3)
    const relatedPosts = posts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    // New Header Template
    const postHeader = `
        <div class="article-header">
            <div class="article-meta-row" style="display: flex; justify-content: space-between; align-items: center; margin: 0 0 1rem 0; color: var(--text-secondary); font-size: 0.95rem;">
                <span class="article-category" style="color: var(--primary); font-weight: 600; text-transform: uppercase;">${post.category}</span>
                <span class="meta-date">${post.date}</span>
            </div>

            <h1 class="article-title" style="margin-bottom: 2rem; margin-top: 0;">${post.title}</h1>

            ${post.image && post.image !== 'assets/hero.png' ?
            `<div class="article-hero" style="margin-top: 1rem; margin-bottom: 3rem;">
                    <img src="${post.image}" alt="${post.title}">
                </div>` : ''
        }
        </div>
    `;

    try {
        const res = await fetch(`content/${path}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
        const text = await res.text();
        const cleanMarkdown = removeFrontmatter(text);

        // Calculate base directory
        const parts = path.split('/');
        parts.pop();
        const baseDir = 'content/' + parts.join('/');

        // Configure Renderer
        const renderer = new marked.Renderer();

        // Image Renderer
        renderer.image = function (href, title, text) {
            if (typeof href === 'object' && href !== null) { title = href.title; text = href.text; href = href.href; }
            href = String(href || '');
            if (href && !href.startsWith('http') && !href.startsWith('data:')) {
                if (!href.includes('/')) href = 'images/' + href;
                const safeBase = baseDir.endsWith('/') ? baseDir : baseDir + '/';
                const safeHref = href.startsWith('/') ? href.slice(1) : href;
                return `<img src="${safeBase}${safeHref}" alt="${text || ''}" title="${title || ''}" class="img-fluid">`;
            }
            return `<img src="${href}" alt="${text || ''}" title="${title || ''}" class="img-fluid">`;
        };

        // Code Renderer
        renderer.code = function (code, infostring, escaped) {
            if (typeof code === 'object' && code !== null) { infostring = code.lang; escaped = code.escaped; code = code.text; }
            code = String(code || '');
            const lang = (infostring || '').match(/\S*/)[0];
            let highlighted = code;
            try {
                if (lang && hljs.getLanguage(lang)) highlighted = hljs.highlight(code, { language: lang }).value;
                else highlighted = hljs.highlightAuto(code).value;
            } catch (err) {
                highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            }
            return `<div class="code-wrapper"><button class="btn-copy" data-clipboard-text="${code.replace(/"/g, '&quot;')}">Copy</button><pre><code class="hljs ${lang}">${highlighted}</code></pre></div>`;
        };

        const htmlContent = marked.parse(cleanMarkdown, { renderer: renderer });

        // Navigation HTML
        const navSection = `
            <hr class="article-divider" style="margin-top: 4rem;">
            <div class="article-navigation" style="display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem;">
                ${nextPost ? `
                    <a href="#/${nextPost.path}" class="nav-btn prev">
                        <span class="nav-label">Newer Post</span>
                        <span class="nav-title">${nextPost.title}</span>
                    </a>
                ` : '<div style="flex:1"></div>'}
                
                ${prevPost ? `
                    <a href="#/${prevPost.path}" class="nav-btn next" style="text-align: right; margin-left: auto;">
                        <span class="nav-label">Older Post</span>
                        <span class="nav-title">${prevPost.title}</span>
                    </a>
                ` : '<div style="flex:1"></div>'}
            </div>
        `;

        // Related Posts HTML
        const relatedSection = relatedPosts.length > 0 ? `
            <div class="related-posts" style="margin-top: 4rem;">
                <h3 class="related-heading" style="font-size: 1.1rem; margin-bottom: 1.5rem; border-left: 4px solid var(--primary); padding-left: 0.75rem;">Related Articles</h3>
                <div class="related-grid">
                    ${relatedPosts.map(p => `
                        <a href="#/${p.path}" class="post-card">
                            <div class="card-image-wrapper">
                                <img src="${p.image}" alt="${p.title}" class="card-image" onerror="this.src='assets/hero.png'">
                            </div>
                            <div class="post-content">
                                <div class="post-meta-top" style="display: flex; justify-content: space-between; margin-bottom: 0.15rem; font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">
                                    <span class="post-category" style="color: var(--primary); text-transform: uppercase;">${p.category}</span>
                                    <span class="meta-date">${p.date}</span>
                                </div>
                                <h3 class="post-title">${p.title}</h3>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        ` : '';

        els.markdownContent.innerHTML = postHeader + htmlContent + navSection + relatedSection;
        new ClipboardJS('.btn-copy');

    } catch (e) {
        console.error(e);
        els.markdownContent.innerHTML = `
            <div style="text-align:center; padding: 4rem;">
                <h1>404 Not Found</h1>
                <p style="color:red;">Error details: ${e.message}</p>
                <p>Path: ${path}</p>
            </div>`;
    }
}

function removeFrontmatter(md) {
    if (md.startsWith('---')) {
        const end = md.indexOf('---', 3);
        if (end !== -1) return md.slice(end + 3).trim();
    }
    return md;
}

init();
