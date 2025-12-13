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
        handleRoute(); // Initial load
    } catch (error) {
        console.error(error);
        alert("Failed to load application");
    }
}

async function loadConfig() {
    // Use absolute path to ensure config loads correctly from any URL
    const res = await fetch('/config.json');
    appState.config = await res.json();
    renderNavBar();
}

function renderNavBar() {
    const { menu } = appState.config;
    // We only update the links container (Bootstrap navbar-nav)
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    navLinks.innerHTML = menu.map(item => `
        <li class="nav-item">
            <a href="/${item.path}" class="nav-link">${item.title}</a>
        </li>
    `).join('');
}

function renderHome(categoryFilter = null) {
    const { hero, posts, home } = appState.config;

    // Filter Logic
    let displayPosts = [...posts]; // Copy array
    let isHome = categoryFilter === null;

    if (isHome) {
        // HOME PAGE LOGIC
        els.sectionHeader.textContent = 'News';
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
        // Case-insensitive comparison for category
        displayPosts = displayPosts.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
        els.sectionHeader.textContent = `${categoryFilter.replace(/^./, c => c.toUpperCase())} Posts`;

        // Hide hero on category pages
        els.heroSection.classList.add('hidden');
    }

    // Render Grid
    if (displayPosts.length === 0) {
        els.blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No posts found.</p>';
        return;
    }

    els.blogGrid.innerHTML = displayPosts.map(post => {
        // Extract slug from path: posts/slug/index.md -> posts/slug
        const slug = post.path.split('/').slice(0, 2).join('/');
        return `
        <a href="/${slug}" class="post-card">
            <div class="card-image-wrapper">
                <img src="${post.image.startsWith('http') ? post.image : '/' + post.image}" alt="${post.title}" class="card-image">
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
    `}).join('');
}

// Render posts filtered by tag
function renderPostsByTag(tagFilter) {
    const { posts } = appState.config;

    // Filter posts that have this tag
    const displayPosts = posts.filter(p =>
        p.tags && p.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase())
    );

    // Update header
    els.sectionHeader.textContent = `Tag: #${tagFilter}`;

    // Hide hero on tag pages
    els.heroSection.classList.add('hidden');

    // Render Grid
    if (displayPosts.length === 0) {
        els.blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No posts found with this tag.</p>';
        return;
    }

    els.blogGrid.innerHTML = displayPosts.map(post => {
        const slug = post.path.split('/').slice(0, 2).join('/');
        return `
        <a href="/${slug}" class="post-card">
            <div class="card-image-wrapper">
                <img src="${post.image.startsWith('http') ? post.image : '/' + post.image}" alt="${post.title}" class="card-image">
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
    `}).join('');
}

let sliderInterval;

function renderHero(hero) {
    // Check if hero is disabled or not configured
    if (!hero || hero.enabled === false) {
        els.heroSection.classList.add('hidden');
        return;
    }

    // Normalize images to slides array: [{image, link}]
    let slides = [];
    if (hero.slides && hero.slides.length > 0) {
        slides = hero.slides;
    } else if (hero.images && hero.images.length > 0) {
        // Fallback for string array (from auto-scan)
        slides = hero.images.map(img => ({ image: img.startsWith('http') ? img : '/' + img, link: hero.link || '/' }));
    } else {
        // Single image fallback
        slides = [{ image: hero.image, link: hero.link || '#' }];
    }

    const isSlider = slides.length > 1;

    let slidesHtml = slides.map((slide, index) => {
        // Fix hash links in hero if any
        let link = slide.link;
        if (link.startsWith('#/')) link = '/' + link.slice(2);

        return `
        <a href="${link}" class="hero-slide ${index === 0 ? 'active' : ''}" style="display: ${index === 0 ? 'block' : 'none'}; width: 100%; height: 100%; position: absolute; top:0; left:0; transition: opacity 0.5s ease;">
            <img src="${slide.image.startsWith('http') ? slide.image : (slide.image.startsWith('/') ? slide.image : '/' + slide.image)}" alt="Hero ${index}" style="width: 100%; height: 100%; object-fit: cover;">
        </a>
    `}).join('');

    let controlsHtml = '';
    if (isSlider) {
        controlsHtml = `
            <button class="slider-btn prev-btn" onclick="changeSlide(-1); event.preventDefault(); event.stopPropagation();">
                <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <button class="slider-btn next-btn" onclick="changeSlide(1); event.preventDefault(); event.stopPropagation();">
                <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
            <div class="slider-dots">
                ${slides.map((_, index) => `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index}); event.preventDefault(); event.stopPropagation();"></div>`).join('')}
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

// Global Slider Functions
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
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        window.changeSlide(1);
    }, 5000);
};

window.pauseSlider = function () {
    if (sliderInterval) clearInterval(sliderInterval);
};

// --- Routing Logic ---

function setupRouting() {
    window.addEventListener('popstate', handleRoute);

    // Intercept clicks for SPA routing
    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin) && !link.getAttribute('target')) {
            e.preventDefault();
            navigateTo(link.getAttribute('href'));
        }
    });
}

function navigateTo(url) {
    history.pushState(null, null, url);
    handleRoute();
}

async function handleRoute() {
    const path = window.location.pathname.slice(1); // Remove leading slash
    const parts = path.split('/');

    // 1. Home
    if (path === '' || path === 'index.html') {
        showHome();
        renderHome(null);
        return;
    }

    // 2. Category: category/Game
    if (parts[0] === 'category') {
        const category = decodeURIComponent(parts[1]);
        showHome();
        renderHome(category);
        return;
    }

    // 2b. Tag: tag/tag-name
    if (parts[0] === 'tag') {
        const tag = decodeURIComponent(parts[1]);
        showHome();
        renderPostsByTag(tag);
        return;
    }

    // 3. Page: page/about-us
    if (parts[0] === 'page') {
        showArticle();
        const pageName = parts[1];
        await loadStaticPage(pageName);
        return;
    }

    // 4. Post: posts/slug
    if (parts[0] === 'posts') {
        showArticle();
        // Config paths are like: posts/slug/index.md
        // URL is: posts/slug or posts/slug/
        // Filter out empty parts from trailing slashes
        const cleanParts = parts.filter(p => p !== '');
        const postSlug = cleanParts[1];
        if (!postSlug) {
            els.markdownContent.innerHTML = '<div style="text-align:center; padding: 4rem;"><h1>Post Not Found</h1><p>No post slug provided.</p></div>';
            return;
        }
        const postConfigPath = `posts/${postSlug}/index.md`;
        await loadContent(postConfigPath);
        return;
    }

    // 5. Direct page access: /page-name/ -> content/pages/page-name/index.html
    // Pages starting with 'exp-' are standalone (redirect to full HTML page)
    // Other pages are embedded in the article container
    const pageName = parts[0].replace(/\/$/, ''); // Remove trailing slash if any

    if (pageName && !pageName.includes('.')) {
        // [FIX] Optimistic redirect for standalone pages to bypass SPA routing issues
        if (pageName.startsWith('exp-')) {
            window.location.href = `/content/pages/${pageName}/index.html`;
            return;
        }

        const pageResult = await checkPageExists(pageName);
        console.log('[DEBUG] Page exists:', pageResult.exists);

        if (pageResult.exists) {
            // Embed in article container
            showArticle();
            await loadStaticPage(pageName, pageResult.path);
            return;
        }
    }

    // 404 Error handling (don't overwrite app.innerHTML as it destroys views)
    showArticle();
    els.markdownContent.innerHTML = `
        <div style="text-align:center; padding: 4rem;">
            <h1>404 - Not Found</h1>
            <p>The page <strong>${path}</strong> could not be found.</p>
            <p><a href="/" onclick="event.preventDefault(); window.history.pushState({}, '', '/'); handleRoute();" style="color: var(--primary); text-decoration: underline;">Return to Home</a></p>
        </div>
    `;
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

// Check if a page exists in content/pages
async function checkPageExists(pageName) {
    try {
        // 1. Try index.html
        let url = `/content/pages/${pageName}/index.html`;
        console.log(`[DEBUG] Fetching: ${url}`);
        let res = await fetch(url, { method: 'GET', cache: 'no-store' });

        if (res.ok) {
            let text = await res.text();
            if (!text.includes('id="app"') || !text.includes('app.js')) {
                return { exists: true, path: url, isIndex: true };
            }
            console.log('[DEBUG] index.html is SPA fallback. Trying view.html...');
        }

        // 2. Try view.html (fallback for embedded pages to avoid serving issues)
        url = `/content/pages/${pageName}/view.html`;
        console.log(`[DEBUG] Fetching: ${url}`);
        res = await fetch(url, { method: 'GET', cache: 'no-store' });
        console.log(`[DEBUG] Status: ${res.status}`);

        if (res.ok) {
            let text = await res.text();
            console.log(`[DEBUG] Content snippet: ${text.substring(0, 50).replace(/\n/g, ' ')}...`);

            if (!text.includes('id="app"') || !text.includes('app.js')) {
                return { exists: true, path: url, isIndex: false };
            }
            console.log('[DEBUG] view.html is also SPA fallback?');
        } else {
            console.log('[DEBUG] view.html not found (404/error)');
        }

        // 3. Try page.txt (final fallback to bypass server HTML interception)
        // We use .txt extension but content is HTML
        url = `/content/pages/${pageName}/page.txt`;
        console.log(`[DEBUG] Fetching: ${url}`);
        res = await fetch(url, { method: 'GET', cache: 'no-store' });

        if (res.ok) {
            let text = await res.text();
            // .txt files shouldn't be intercepted, but good to check
            if (!text.includes('id="app"') || !text.includes('app.js')) {
                return { exists: true, path: url, isIndex: false };
            }
        }

        return { exists: false };
    } catch (e) {
        console.error('[DEBUG] Fetch error:', e);
        return { exists: false };
    }
}

async function loadStaticPage(pageName, customPath = null) {
    els.markdownContent.innerHTML = '<div class="loading">Loading...</div>';

    // Attempt to fetch content/pages/{pageName}/index.html OR content/pages/{pageName}/index.md
    // Requirements say: content/pages folder. "domain/page/tên-page (tên page là tên folder chứa page đó)"
    // We assume index.html inside that folder, or custom path if provided
    const pagePath = customPath || `/content/pages/${pageName}/index.html`;

    try {
        const res = await fetch(pagePath);
        if (!res.ok) throw new Error("Page not found");
        const html = await res.text();
        els.markdownContent.innerHTML = html;

        // Execute scripts found in the HTML
        const scripts = els.markdownContent.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    } catch (e) {
        console.error(e);
        els.markdownContent.innerHTML = `
            <div style="text-align:center; padding: 4rem;">
                <h1>404 Page Not Found</h1>
                <p>Could not load page: ${pageName}</p>
            </div>`;
    }
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
    const nextPost = postIndex > 0 ? posts[postIndex - 1] : null;
    const prevPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

    // Related Posts
    const relatedPosts = posts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3);

    // Tags HTML - clickable buttons linking to tag pages
    let tagsHtml = '';
    if (post.tags && post.tags.length > 0) {
        tagsHtml = `
            <div class="article-tags">
                ${post.tags.map(tag => `
                    <a href="/tag/${encodeURIComponent(tag)}" class="tag-btn">#${tag}</a>
                `).join('')}
            </div>
        `;
    }

    // New Header Template
    const postHeader = `
        <div class="article-header">
            <div class="article-meta-row" style="display: flex; justify-content: space-between; align-items: center; margin: 0 0 1rem 0; color: var(--text-secondary); font-size: 0.95rem;">
                <span class="article-category" style="color: var(--primary); font-weight: 600; text-transform: uppercase;">${post.category}</span>
                <span class="meta-date">${post.date}</span>
            </div>

            <h1 class="article-title" style="margin-bottom: 1rem; margin-top: 0;">${post.title}</h1>
            
            ${tagsHtml}

            ${post.image ?
            `<div class="article-hero" style="margin-top: 1rem; margin-bottom: 3rem;">
                    <img src="${post.image.startsWith('http') ? post.image : '/' + post.image}" alt="${post.title}">
                </div>` : ''
        }
        </div>
    `;

    try {
        const res = await fetch(`/content/${path}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
        const text = await res.text();

        // Check if we accidentally got HTML instead of markdown (serve --single issue)
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            throw new Error('Server returned HTML instead of markdown. Please ensure server is configured correctly.');
        }

        const cleanMarkdown = removeFrontmatter(text);

        // Calculate base directory (with leading slash for absolute paths)
        const parts = path.split('/');
        parts.pop();
        const baseDir = '/content/' + parts.join('/');

        const renderer = new marked.Renderer();

        // Image & Video Renderer
        renderer.image = function (href, title, text) {
            if (typeof href === 'object' && href !== null) { title = href.title; text = href.text; href = href.href; }
            href = String(href || '');

            if (href && !href.startsWith('http') && !href.startsWith('data:')) {
                if (!href.includes('/')) href = 'images/' + href;
                const safeBase = baseDir.endsWith('/') ? baseDir : baseDir + '/';
                const safeHref = href.startsWith('/') ? href.slice(1) : href;
                const finalPath = safeBase + safeHref;

                if (/\.(mp4|webm|ogg|mov)$/i.test(finalPath)) {
                    return `<video controls style="max-width: 100%; display: block; margin: 1rem auto;" title="${title || ''}">
                                <source src="${finalPath}">
                                Your browser does not support the video tag.
                             </video>`;
                }
                return `<img src="${finalPath}" alt="${text || ''}" title="${title || ''}" class="img-fluid">`;
            }

            if (/\.(mp4|webm|ogg|mov)$/i.test(href)) {
                return `<video controls style="max-width: 100%; display: block; margin: 1rem auto;" title="${title || ''}">
                           <source src="${href}">
                           Your browser does not support the video tag.
                        </video>`;
            }
            return `<img src="${href}" alt="${text || ''}" title="${title || ''}" class="img-fluid">`;
        };

        // Link Renderer
        renderer.link = function (href, title, text) {
            // Handle marked.js object format (newer versions pass an object)
            if (typeof href === 'object' && href !== null) {
                title = href.title;
                text = href.text;
                href = href.href;
            }
            href = String(href || '');
            text = String(text || '');

            // Convert internal links from old domain to local paths
            // e.g., https://expvn.com/post-slug/ -> /posts/post-slug
            if (href.startsWith('https://expvn.com/') || href.startsWith('http://expvn.com/')) {
                let slug = href.replace(/^https?:\/\/expvn\.com\//, '');
                // Remove trailing slash from slug
                slug = slug.replace(/\/$/, '');
                href = '/posts/' + slug;
            }

            if (href && !href.startsWith('http') && !href.startsWith('data:') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                // Don't modify paths that already start with /posts/
                if (!href.startsWith('/posts/')) {
                    const safeBase = baseDir.endsWith('/') ? baseDir : baseDir + '/';
                    const safeHref = href.startsWith('/') ? href.slice(1) : href;
                    href = safeBase + safeHref;
                }
            }
            return `<a href="${href}" title="${title || ''}" target="${href.startsWith('http') ? '_blank' : '_self'}">${text}</a>`;
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

        // Update nav buttons to use new path structure
        // path is 'posts/slug/index.md'
        // we want '/posts/slug'
        const getSlug = (p) => '/' + p.split('/').slice(0, 2).join('/');

        const navSection = `
            <hr class="article-divider" style="margin-top: 4rem;">
            <div class="article-navigation" style="display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem;">
                ${nextPost ? `
                    <a href="${getSlug(nextPost.path)}" class="nav-btn prev">
                        <span class="nav-label">Newer Post</span>
                        <span class="nav-title">${nextPost.title}</span>
                    </a>
                ` : '<div style="flex:1"></div>'}
                
                ${prevPost ? `
                    <a href="${getSlug(prevPost.path)}" class="nav-btn next" style="text-align: right; margin-left: auto;">
                        <span class="nav-label">Older Post</span>
                        <span class="nav-title">${prevPost.title}</span>
                    </a>
                ` : '<div style="flex:1"></div>'}
            </div>
        `;

        const relatedSection = relatedPosts.length > 0 ? `
            <div class="related-posts" style="margin-top: 4rem;">
                <h3 class="related-heading" style="font-size: 1.1rem; margin-bottom: 1.5rem; border-left: 4px solid var(--primary); padding-left: 0.75rem;">Related Articles</h3>
                <div class="related-grid">
                    ${relatedPosts.map(p => `
                        <a href="${getSlug(p.path)}" class="post-card">
                            <div class="card-image-wrapper">
                                <img src="${p.image.startsWith('http') ? p.image : '/' + p.image}" alt="${p.title}" class="card-image">
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
