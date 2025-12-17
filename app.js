const appState = {
    config: {
        site: null,
        hero: null,
        home: null,
        menu: null,
        pagination: null,
        postsIndex: null,
        categories: null,
        tags: null
    },
    loadedPostPages: {}, // Cache for loaded post pages
    currentPath: null
};

// ============= SEO MANAGER =============
const SEO = {
    // Get base URL from site config (loaded after init)
    get baseUrl() {
        return appState.config?.site?.siteUrl || 'https://example.com';
    },
    get defaultImage() {
        return '/' + (appState.config?.site?.logo || 'assets/logo.png');
    },

    // Update all meta tags for a page
    updateMeta(options) {
        const {
            title,
            description,
            image,
            url,
            type = 'website',
            author,
            publishedTime,
            modifiedTime,
            category,
            tags = []
        } = options;

        const fullUrl = url ? `${this.baseUrl}${url}` : this.baseUrl;
        const fullImage = image ? (image.startsWith('http') ? image : `${this.baseUrl}/${image.replace(/^\//, '')}`) : `${this.baseUrl}${this.defaultImage}`;
        const siteName = appState.config?.site?.siteTitle || 'EXPVN';
        const fullTitle = title ? `${title} | ${siteName}` : siteName;

        // Update document title
        document.title = fullTitle;

        // Update primary meta tags
        this.setMeta('name', 'title', fullTitle);
        this.setMeta('name', 'description', description || '');
        this.setMeta('name', 'author', author || 'EXPVN');

        // Update canonical URL
        this.setLink('canonical', fullUrl);

        // Update Open Graph tags
        this.setMeta('property', 'og:type', type === 'post' ? 'article' : 'website');
        this.setMeta('property', 'og:url', fullUrl);
        this.setMeta('property', 'og:title', fullTitle);
        this.setMeta('property', 'og:description', description || '');
        this.setMeta('property', 'og:image', fullImage);
        this.setMeta('property', 'og:site_name', siteName);

        // Update Twitter Cards
        this.setMeta('name', 'twitter:url', fullUrl);
        this.setMeta('name', 'twitter:title', fullTitle);
        this.setMeta('name', 'twitter:description', description || '');
        this.setMeta('name', 'twitter:image', fullImage);

        // Update article-specific meta tags
        if (type === 'post') {
            if (publishedTime) {
                this.setMeta('property', 'article:published_time', publishedTime);
            }
            if (modifiedTime) {
                this.setMeta('property', 'article:modified_time', modifiedTime);
            }
            if (category) {
                this.setMeta('property', 'article:section', category);
            }
            if (tags.length > 0) {
                // Remove old article:tag meta tags
                document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
                // Add new ones
                tags.forEach(tag => {
                    const meta = document.createElement('meta');
                    meta.setAttribute('property', 'article:tag');
                    meta.setAttribute('content', tag);
                    document.head.appendChild(meta);
                });
            }
        }

        // Update JSON-LD structured data
        this.updateStructuredData(options);
    },

    // Set or update a meta tag
    setMeta(attrType, attrName, content) {
        let meta = document.querySelector(`meta[${attrType}="${attrName}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attrType, attrName);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    },

    // Set or update a link tag
    setLink(rel, href) {
        let link = document.querySelector(`link[rel="${rel}"]`);
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', rel);
            document.head.appendChild(link);
        }
        link.setAttribute('href', href);
    },

    // Update JSON-LD structured data
    updateStructuredData(options) {
        const {
            title,
            description,
            image,
            url,
            type = 'website',
            author,
            publishedTime,
            category
        } = options;

        const fullUrl = url ? `${this.baseUrl}${url}` : this.baseUrl;
        const fullImage = image ? (image.startsWith('http') ? image : `${this.baseUrl}/${image.replace(/^\//, '')}`) : `${this.baseUrl}${this.defaultImage}`;
        const siteName = appState.config?.site?.siteTitle || 'EXPVN';

        let structuredData;

        if (type === 'post') {
            // Article schema
            structuredData = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": title,
                "description": description || '',
                "image": fullImage,
                "url": fullUrl,
                "datePublished": publishedTime || new Date().toISOString(),
                "author": {
                    "@type": "Person",
                    "name": author || "EXPVN"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": siteName,
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${this.baseUrl}${this.defaultImage}`
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": fullUrl
                }
            };
            if (category) {
                structuredData.articleSection = category;
            }
        } else if (type === 'category') {
            // Collection page schema
            structuredData = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": title,
                "description": description || '',
                "url": fullUrl,
                "isPartOf": {
                    "@type": "WebSite",
                    "name": siteName,
                    "url": this.baseUrl
                }
            };
        } else {
            // Default website schema
            structuredData = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": siteName,
                "url": this.baseUrl,
                "description": description || appState.config?.site?.description || '',
                "publisher": {
                    "@type": "Organization",
                    "name": siteName,
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${this.baseUrl}${this.defaultImage}`
                    }
                }
            };
        }

        // Update or create script tag
        let script = document.getElementById('structured-data');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'structured-data';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData, null, 2);
    },

    // Reset to default homepage SEO
    resetToDefault() {
        const site = appState.config?.site || {};
        this.updateMeta({
            title: null,
            description: site.description || 'Blog chia sẻ kiến thức về Game, Công nghệ, Lập trình',
            url: '/',
            type: 'website'
        });
    },

    // Update SEO for a post
    updateForPost(post) {
        this.updateMeta({
            title: post.title,
            description: post.summary || '',
            image: post.image,
            url: `/posts/${post.slug}`,
            type: 'post',
            author: post.author,
            publishedTime: post.dateRaw,
            category: post.category,
            tags: post.tags || []
        });
    },

    // Update SEO for a category page
    updateForCategory(categoryName) {
        this.updateMeta({
            title: `${categoryName} - Danh mục bài viết`,
            description: `Tất cả bài viết trong danh mục ${categoryName}`,
            url: `/category/${categoryName.toLowerCase()}`,
            type: 'category',
            category: categoryName
        });
    },

    // Update SEO for a tag page
    updateForTag(tagName) {
        this.updateMeta({
            title: `#${tagName} - Bài viết theo tag`,
            description: `Tất cả bài viết có tag ${tagName}`,
            url: `/tag/${encodeURIComponent(tagName)}`,
            type: 'category'
        });
    }
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
    // Load essential config files in parallel
    const [site, hero, home, menu, pagination, postsIndex, categories, tags] = await Promise.all([
        fetch('/config/site.json').then(r => r.json()),
        fetch('/config/hero.json').then(r => r.json()),
        fetch('/config/home.json').then(r => r.json()),
        fetch('/config/menu.json').then(r => r.json()),
        fetch('/config/pagination.json').then(r => r.json()),
        fetch('/config/posts-index.json').then(r => r.json()),
        fetch('/config/categories.json').then(r => r.json()),
        fetch('/config/tags.json').then(r => r.json())
    ]);

    appState.config = { site, hero, home, menu, pagination, postsIndex, categories, tags };
    appState.loadedCategories = {}; // Cache for category posts
    appState.currentPage = 1;

    // Apply site-wide config (navbar, footer, etc.)
    applySiteConfig(site);

    // Only load page 1 for initial homepage render
    await loadPostsPage(1);

    renderNavBar();
}

// Apply site configuration to UI elements
function applySiteConfig(site) {
    // Update navbar brand
    const navSiteName = document.getElementById('nav-site-name');
    if (navSiteName) navSiteName.textContent = site.siteName || site.siteTitle || 'My Site';

    // Update footer
    const footerSiteName = document.getElementById('footer-site-name');
    if (footerSiteName) footerSiteName.textContent = site.siteName || site.siteTitle || 'My Site';

    const footerCopyright = document.getElementById('footer-copyright');
    if (footerCopyright && site.footer?.copyright) {
        footerCopyright.textContent = site.footer.copyright;
    }

    // Update document title if on homepage
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        document.title = site.siteTitle || 'My Website';
    }
}

// Load a specific page of posts (lazy loading)
async function loadPostsPage(pageNum) {
    if (appState.loadedPostPages[pageNum]) {
        return appState.loadedPostPages[pageNum];
    }

    try {
        const res = await fetch(`/config/posts/page-${pageNum}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        appState.loadedPostPages[pageNum] = data;
        return data;
    } catch (e) {
        console.error(`Failed to load posts page ${pageNum}:`, e);
        return null;
    }
}

// Get all loaded posts (flattened from all loaded pages)
function getAllLoadedPosts() {
    const posts = [];
    Object.values(appState.loadedPostPages).forEach(page => {
        if (page && page.posts) {
            posts.push(...page.posts);
        }
    });
    return posts;
}

// Find a post by slug (loads more pages if needed)
async function findPostBySlug(slug) {
    // First check already loaded posts
    for (const page of Object.values(appState.loadedPostPages)) {
        if (page && page.posts) {
            const post = page.posts.find(p => p.slug === slug);
            if (post) return post;
        }
    }

    // If not found, search in index and load the right page
    const index = appState.config.postsIndex.findIndex(p => p.slug === slug);
    if (index === -1) return null;

    const pageNum = Math.floor(index / appState.config.pagination.postsPerPage) + 1;
    const pageData = await loadPostsPage(pageNum);
    if (pageData && pageData.posts) {
        return pageData.posts.find(p => p.slug === slug);
    }
    return null;
}

// Load category-specific posts (lazy loading)
async function loadCategoryPosts(categorySlug) {
    if (appState.loadedCategories[categorySlug]) {
        return appState.loadedCategories[categorySlug];
    }

    try {
        const res = await fetch(`/config/categories/${categorySlug}.json`);
        if (!res.ok) return null;
        const data = await res.json();
        appState.loadedCategories[categorySlug] = data;
        return data;
    } catch (e) {
        console.error(`Failed to load category ${categorySlug}:`, e);
        return null;
    }
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

function renderHome(categoryFilter = null, pageNum = 1) {
    const { hero, home, pagination, postsIndex } = appState.config;
    let isHome = categoryFilter === null;

    if (isHome) {
        // HOME PAGE LOGIC
        els.sectionHeader.textContent = 'News';
        els.heroSection.classList.remove('hidden');
        renderHero(hero);

        const limit = (home && home.limit) || 6;
        const postsPerPage = 12; // Max posts per page before pagination

        // Calculate which posts to show based on limit and page
        let allFilteredPostsIndex = [...postsIndex];

        // Apply home categories filter if defined
        if (home && home.categories && home.categories.length > 0) {
            allFilteredPostsIndex = allFilteredPostsIndex.filter(p => home.categories.includes(p.category));
        }

        // Total posts to consider (capped by limit)
        const totalPosts = Math.min(limit, allFilteredPostsIndex.length);
        const needsPagination = limit > postsPerPage && totalPosts > postsPerPage;

        if (needsPagination) {
            // Pagination mode: show postsPerPage posts per page
            const totalPages = Math.ceil(totalPosts / postsPerPage);
            const startIdx = (pageNum - 1) * postsPerPage;
            const endIdx = Math.min(startIdx + postsPerPage, totalPosts);

            // Get posts for this page from loaded pages
            const postsToShow = [];
            for (let i = startIdx; i < endIdx; i++) {
                const postMeta = allFilteredPostsIndex[i];
                // Find full post data from loaded pages
                for (const page of Object.values(appState.loadedPostPages)) {
                    if (page && page.posts) {
                        const found = page.posts.find(p => p.slug === postMeta.slug);
                        if (found) {
                            postsToShow.push(found);
                            break;
                        }
                    }
                }
            }

            renderPostsGrid(postsToShow);

            if (totalPages > 1) {
                renderPagination(pageNum, totalPages, null);
            }
        } else {
            // No pagination: show up to limit posts
            const pageData = appState.loadedPostPages[1];
            if (!pageData) {
                els.blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading...</p>';
                return;
            }

            let displayPosts = [...pageData.posts];

            // Apply home categories filter
            if (home && home.categories && home.categories.length > 0) {
                displayPosts = displayPosts.filter(p => home.categories.includes(p.category));
            }

            // Apply limit
            displayPosts = displayPosts.slice(0, limit);

            renderPostsGrid(displayPosts);

            // Clear pagination
            const paginationContainer = document.getElementById('pagination-container');
            if (paginationContainer) {
                paginationContainer.innerHTML = '';
            }
        }

    } else {
        // CATEGORY PAGE LOGIC - use lazy loaded category data
        els.heroSection.classList.add('hidden');
        els.sectionHeader.textContent = `${categoryFilter.replace(/^./, c => c.toUpperCase())} Posts`;

        // Load category posts if not already loaded
        const catSlug = categoryFilter.toLowerCase().replace(/\s+/g, '-');
        const catData = appState.loadedCategories[catSlug];

        if (!catData) {
            els.blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading...</p>';
            return;
        }

        const postsPerPage = 12; // Posts per page for category
        const totalPages = Math.ceil(catData.posts.length / postsPerPage);
        const startIdx = (pageNum - 1) * postsPerPage;
        const displayPosts = catData.posts.slice(startIdx, startIdx + postsPerPage);

        renderPostsGrid(displayPosts);

        // Render pagination if needed
        if (totalPages > 1) {
            renderPagination(pageNum, totalPages, categoryFilter);
        }
    }
}

// Render posts grid (extracted for reuse)
function renderPostsGrid(displayPosts) {
    if (displayPosts.length === 0) {
        els.blogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No posts found.</p>';
        return;
    }

    els.blogGrid.innerHTML = displayPosts.map(post => {
        const slug = post.path.split('/').slice(0, 2).join('/');
        return `
        <a href="/${slug}" class="post-card">
            <div class="card-image-wrapper">
                <img src="${post.image.startsWith('http') ? post.image : '/' + post.image}" alt="${post.title}" class="card-image" loading="lazy">
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

// Render pagination UI
function renderPagination(currentPage, totalPages, categoryFilter) {
    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination-container';
        els.blogGrid.parentNode.insertBefore(paginationContainer, els.blogGrid.nextSibling);
    }

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const categoryParam = categoryFilter ? `'${categoryFilter}'` : 'null';

    let paginationHtml = `
        <div class="pagination" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin: 2rem 0; flex-wrap: wrap;">
            ${currentPage > 1 ? `
                <button onclick="goToPage(${currentPage - 1}, ${categoryParam})" class="page-btn" style="padding: 0.5rem 1rem; border: 1px solid var(--border); background: var(--bg-secondary); border-radius: 8px; cursor: pointer;">
                    ← Prev
                </button>
            ` : ''}
            
            ${startPage > 1 ? `
                <button onclick="goToPage(1, ${categoryParam})" class="page-btn" style="padding: 0.5rem 0.75rem; border: 1px solid var(--border); background: var(--bg-secondary); border-radius: 8px; cursor: pointer;">1</button>
                ${startPage > 2 ? '<span style="padding: 0 0.5rem;">...</span>' : ''}
            ` : ''}
            
            ${Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => `
                <button onclick="goToPage(${page}, ${categoryParam})" class="page-btn ${page === currentPage ? 'active' : ''}" style="padding: 0.5rem 0.75rem; border: 1px solid ${page === currentPage ? 'var(--primary)' : 'var(--border)'}; background: ${page === currentPage ? 'var(--primary)' : 'var(--bg-secondary)'}; color: ${page === currentPage ? 'white' : 'inherit'}; border-radius: 8px; cursor: pointer; font-weight: ${page === currentPage ? '600' : '400'};">
                    ${page}
                </button>
            `).join('')}
            
            ${endPage < totalPages ? `
                ${endPage < totalPages - 1 ? '<span style="padding: 0 0.5rem;">...</span>' : ''}
                <button onclick="goToPage(${totalPages}, ${categoryParam})" class="page-btn" style="padding: 0.5rem 0.75rem; border: 1px solid var(--border); background: var(--bg-secondary); border-radius: 8px; cursor: pointer;">${totalPages}</button>
            ` : ''}
            
            ${currentPage < totalPages ? `
                <button onclick="goToPage(${currentPage + 1}, ${categoryParam})" class="page-btn" style="padding: 0.5rem 1rem; border: 1px solid var(--border); background: var(--bg-secondary); border-radius: 8px; cursor: pointer;">
                    Next →
                </button>
            ` : ''}
        </div>
    `;

    paginationContainer.innerHTML = paginationHtml;
}

// Global function to handle page navigation
window.goToPage = async function (pageNum, categoryFilter) {
    if (categoryFilter === null) {
        // Homepage pagination - load the page if not loaded
        if (!appState.loadedPostPages[pageNum]) {
            await loadPostsPage(pageNum);
        }
        appState.currentPage = pageNum;
        showHome();
        renderHome(null, pageNum);
    } else {
        // Category pagination - just re-render with new page
        showHome();
        renderHome(categoryFilter, pageNum);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render posts filtered by tag
function renderPostsByTag(tagFilter) {
    const posts = getAllLoadedPosts();

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

    // Clear pagination when navigating
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
    }

    // 1. Home
    if (path === '' || path === 'index.html') {
        SEO.resetToDefault();
        showHome();
        renderHome(null, appState.currentPage || 1);
        return;
    }

    // 2. Category: category/Game
    if (parts[0] === 'category') {
        const category = decodeURIComponent(parts[1]);
        const catSlug = category.toLowerCase().replace(/\s+/g, '-');

        // Lazy load category data
        if (!appState.loadedCategories[catSlug]) {
            await loadCategoryPosts(catSlug);
        }

        SEO.updateForCategory(category);
        showHome();
        renderHome(category, 1);
        return;
    }

    // 2b. Tag: tag/tag-name
    if (parts[0] === 'tag') {
        const tag = decodeURIComponent(parts[1]);
        SEO.updateForTag(tag);
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

    // 5a. Standalone pages: /pages/page-name -> load in fullscreen iframe (keeps URL short)
    if (parts[0] === 'pages' && parts[1]) {
        const pageName = parts[1].replace(/\/$/, '');
        const standaloneResult = await checkStandalonePage(pageName);
        if (standaloneResult.exists) {
            loadStandalonePage(standaloneResult.path, pageName);
            return;
        }
    }

    // 5b. Embedded pages: /page-name -> content/pages/Embedded/page-name/index.html
    const pageName = parts[0].replace(/\/$/, ''); // Remove trailing slash if any

    if (pageName && !pageName.includes('.')) {
        // Check Embedded directory (embed in article container)
        const embeddedResult = await checkEmbeddedPage(pageName);
        console.log('[DEBUG] Embedded page exists:', embeddedResult.exists);

        if (embeddedResult.exists) {
            showArticle();
            await loadStaticPage(pageName, embeddedResult.path);
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

// Check if a standalone page exists in content/pages/Standalone
async function checkStandalonePage(pageName) {
    try {
        const url = `/content/pages/Standalone/${pageName}/index.html`;
        console.log(`[DEBUG] Checking Standalone: ${url}`);
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });

        if (res.ok) {
            return { exists: true, path: url };
        }
        return { exists: false };
    } catch (e) {
        console.error('[DEBUG] Standalone check error:', e);
        return { exists: false };
    }
}

// Check if an embedded page exists in content/pages/Embedded
async function checkEmbeddedPage(pageName) {
    try {
        // 1. Try index.html
        let url = `/content/pages/Embedded/${pageName}/index.html`;
        console.log(`[DEBUG] Checking Embedded: ${url}`);
        let res = await fetch(url, { method: 'GET', cache: 'no-store' });

        if (res.ok) {
            let text = await res.text();
            if (!text.includes('id="app"') || !text.includes('app.js')) {
                return { exists: true, path: url, isIndex: true };
            }
            console.log('[DEBUG] index.html is SPA fallback. Trying view.html...');
        }

        // 2. Try view.html (fallback for embedded pages to avoid serving issues)
        url = `/content/pages/Embedded/${pageName}/view.html`;
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
        url = `/content/pages/Embedded/${pageName}/page.txt`;
        console.log(`[DEBUG] Fetching: ${url}`);
        res = await fetch(url, { method: 'GET', cache: 'no-store' });

        if (res.ok) {
            let text = await res.text();
            if (!text.includes('id="app"') || !text.includes('app.js')) {
                return { exists: true, path: url, isIndex: false };
            }
        }

        return { exists: false };
    } catch (e) {
        console.error('[DEBUG] Embedded check error:', e);
        return { exists: false };
    }
}

// Fetch page metadata from page.json
async function fetchPageMetadata(baseDir) {
    try {
        const res = await fetch(`${baseDir}/page.json`, { cache: 'no-store' });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log('[DEBUG] No page.json found, using defaults');
    }
    return null;
}

// Load standalone page in fullscreen iframe (keeps URL short)
async function loadStandalonePage(pagePath, pageName) {
    // Fetch metadata
    const baseDir = pagePath.replace('/index.html', '');
    const metadata = await fetchPageMetadata(baseDir) || {};

    const title = metadata.title || pageName;
    const bgColor = metadata.background || '#000';

    // Hide everything and show fullscreen iframe
    els.homeView.classList.add('hidden');
    els.articleView.classList.add('hidden');

    // Create or reuse standalone container
    let standaloneContainer = document.getElementById('standalone-container');
    if (!standaloneContainer) {
        standaloneContainer = document.createElement('div');
        standaloneContainer.id = 'standalone-container';
        els.app.appendChild(standaloneContainer);
    }

    standaloneContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background: ${bgColor};
    `;

    standaloneContainer.innerHTML = `
        <div style="
            position: fixed;
            top: 15px;
            left: 15px;
            right: 15px;
            z-index: 10001;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <span style="
                color: white;
                font-size: 1.1rem;
                font-weight: 600;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            ">${title}</span>
            <button onclick="closeStandalonePage()" style="
                background: rgba(255,255,255,0.9);
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                font-size: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">✕</button>
        </div>
        <iframe src="${pagePath}" style="
            width: 100%;
            height: 100%;
            border: none;
        " allowfullscreen></iframe>
    `;
    standaloneContainer.classList.remove('hidden');

    // Update page title
    document.title = `${title} | ${appState.config.site?.siteTitle || 'EXPVN'}`;
}

// Close standalone page and return to previous view
window.closeStandalonePage = function () {
    const standaloneContainer = document.getElementById('standalone-container');
    if (standaloneContainer) {
        standaloneContainer.classList.add('hidden');
        standaloneContainer.innerHTML = '';
    }
    window.history.back();
}

// Load embedded page with metadata support
async function loadStaticPage(pageName, customPath = null) {
    const baseDir = `/content/pages/Embedded/${pageName}`;
    const pagePath = customPath || `${baseDir}/index.html`;

    // Fetch metadata
    const metadata = await fetchPageMetadata(baseDir) || {};

    const title = metadata.title;
    const description = metadata.description || '';
    const height = metadata.height || '80vh';
    const width = metadata.width || '100%';  // Custom width support
    const type = metadata.type || 'static'; // static | webgl | form | video
    const bgColor = metadata.background || 'transparent';
    const fullWidth = metadata.fullWidth || false; // Break out of container

    // Embed mode: 'inject' (HTML injection) or 'iframe' (isolated iframe)
    // Default: 'inject' for static, 'iframe' for webgl/video/form
    const embedMode = metadata.embed || (type === 'static' ? 'inject' : 'iframe');

    // Build header section
    let headerHtml = '';
    if (title || description) {
        headerHtml = `
            <div class="embedded-page-header" style="margin-bottom: 1.5rem;">
                ${title ? `<h1 style="margin: 0 0 0.5rem 0; font-size: 1.8rem; color: var(--text-primary);">${title}</h1>` : ''}
                ${description ? `<p style="margin: 0; color: var(--text-secondary);">${description}</p>` : ''}
                ${type !== 'static' ? `<span style="display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.75rem; background: var(--primary); color: white; border-radius: 20px; font-size: 0.8rem; text-transform: uppercase;">${type}</span>` : ''}
            </div>
        `;
    }

    // Choose embed method based on metadata
    if (embedMode === 'inject') {
        // HTML Injection mode - for simple static pages
        try {
            const res = await fetch(pagePath);
            if (!res.ok) throw new Error("Page not found");
            const html = await res.text();

            els.markdownContent.innerHTML = `
                ${headerHtml}
                <div class="embedded-page-content" style="background: ${bgColor}; border-radius: 12px; overflow: hidden;">
                    ${html}
                </div>
            `;

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
                ${headerHtml}
                <div style="text-align:center; padding: 4rem;">
                    <h1>404 Page Not Found</h1>
                    <p>Could not load page: ${pageName}</p>
                </div>`;
        }
    } else {
        // Iframe mode - for WebGL, complex scripts, forms
        // fullWidth: break out of container to full viewport width
        const containerStyle = fullWidth ? `
            width: 100vw;
            margin-left: calc(-50vw + 50%);
            min-height: ${height};
            position: relative;
            overflow: hidden;
            background: ${bgColor};
        ` : `
            width: ${width};
            min-height: ${height};
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            background: ${bgColor};
            margin: 0 auto;
        `;

        els.markdownContent.innerHTML = `
            ${headerHtml}
            <div class="embedded-page-container" style="${containerStyle}">
                <iframe 
                    src="${pagePath}" 
                    style="
                        width: 100%;
                        height: ${height};
                        border: none;
                        display: block;
                    "
                    allowfullscreen
                ></iframe>
            </div>
        `;
    }

    // Update page title
    document.title = `${title} | ${appState.config.site?.siteTitle || 'EXPVN'}`;
}


async function loadContent(path) {
    els.markdownContent.innerHTML = '<div class="loading">Loading...</div>';

    // Find Post Metadata & Index from Config
    const posts = getAllLoadedPosts();
    const postIndex = posts.findIndex(p => p.path === path);
    let post = posts[postIndex];

    // If post not found in loaded pages, try to find by slug
    if (!post) {
        const slug = path.replace('posts/', '').replace('/index.md', '');
        post = await findPostBySlug(slug);
    }

    if (!post) {
        els.markdownContent.innerHTML = `
            <div style="text-align:center; padding: 4rem;">
                <h1>Post Not Found</h1>
                <p>Path: ${path}</p>
            </div>`;
        return;
    }

    // Update SEO for this post
    SEO.updateForPost(post);

    // Use postsIndex for prev/next navigation (lightweight)
    const postsIndex = appState.config.postsIndex;
    const indexPos = postsIndex.findIndex(p => p.slug === post.slug);
    const nextPostMeta = indexPos > 0 ? postsIndex[indexPos - 1] : null;
    const prevPostMeta = indexPos < postsIndex.length - 1 ? postsIndex[indexPos + 1] : null;

    // Related Posts from same category
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

        // Image & Video Renderer - with lightbox support for images
        renderer.image = function (href, title, text) {
            if (typeof href === 'object' && href !== null) { title = href.title; text = href.text; href = href.href; }
            href = String(href || '');

            if (href && !href.startsWith('http') && !href.startsWith('data:')) {
                if (!href.includes('/')) href = 'images/' + href;
                const safeBase = baseDir.endsWith('/') ? baseDir : baseDir + '/';
                const safeHref = href.startsWith('/') ? href.slice(1) : href;
                const finalPath = safeBase + safeHref;

                if (/\.(mp4|webm|ogg|mov)$/i.test(finalPath)) {
                    return `
                        <div class="video-container" style="position: relative; width: 100%; margin: 1.5rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                            <video controls style="width: 100%; display: block;" preload="metadata">
                                <source src="${finalPath}">
                                Your browser does not support the video tag.
                            </video>
                        </div>`;
                }
                return `<img src="${finalPath}" alt="${text || ''}" title="${title || ''}" class="img-fluid article-img" style="cursor: zoom-in;">`;
            }

            if (/\.(mp4|webm|ogg|mov)$/i.test(href)) {
                return `
                    <div class="video-container" style="position: relative; width: 100%; margin: 1.5rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                        <video controls style="width: 100%; display: block;" preload="metadata">
                            <source src="${href}">
                            Your browser does not support the video tag.
                        </video>
                    </div>`;
            }
            return `<img src="${href}" alt="${text || ''}" title="${title || ''}" class="img-fluid article-img" style="cursor: zoom-in;">`;
        };

        // Link Renderer - with YouTube and video embedding
        renderer.link = function (href, title, text) {
            // Handle marked.js object format (newer versions pass an object)
            if (typeof href === 'object' && href !== null) {
                title = href.title;
                text = href.text;
                href = href.href;
            }
            href = String(href || '');
            text = String(text || '');

            // Check for YouTube links - embed as iframe
            const youtubeMatch = href.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (youtubeMatch) {
                const videoId = youtubeMatch[1];
                return `
                    <div class="video-container" style="position: relative; width: 100%; padding-bottom: 56.25%; margin: 1.5rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                        <iframe 
                            src="https://www.youtube.com/embed/${videoId}?rel=0" 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            title="${title || text || 'YouTube Video'}"
                        ></iframe>
                    </div>`;
            }

            // Check for video file links (.mp4, .webm, .ogg, .mov)
            if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(href)) {
                return `
                    <div class="video-container" style="position: relative; width: 100%; margin: 1.5rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                        <video controls style="width: 100%; display: block;" preload="metadata">
                            <source src="${href}">
                            Your browser does not support the video tag.
                        </video>
                    </div>`;
            }

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
                ${nextPostMeta ? `
                    <a href="/posts/${nextPostMeta.slug}" class="nav-btn prev">
                        <span class="nav-label">Newer Post</span>
                        <span class="nav-title">${nextPostMeta.title}</span>
                    </a>
                ` : '<div style="flex:1"></div>'}
                
                ${prevPostMeta ? `
                    <a href="/posts/${prevPostMeta.slug}" class="nav-btn next" style="text-align: right; margin-left: auto;">
                        <span class="nav-label">Older Post</span>
                        <span class="nav-title">${prevPostMeta.title}</span>
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

        // Initialize ClipboardJS with feedback
        const clipboard = new ClipboardJS('.btn-copy');
        clipboard.on('success', function (e) {
            const btn = e.trigger;
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
            e.clearSelection();
        });
        clipboard.on('error', function (e) {
            const btn = e.trigger;
            btn.textContent = '✗ Failed';
            setTimeout(() => {
                btn.textContent = 'Copy';
            }, 2000);
        });

        // Initialize image lightbox for article images
        initImageLightbox();

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

// ==========================================================================
// SEARCH FUNCTIONALITY
// ==========================================================================

// Toggle search overlay
window.toggleSearch = function () {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    if (overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
        input.focus();
        document.body.style.overflow = 'hidden'; // Prevent scroll

        // Show initial hint
        results.innerHTML = '<div class="search-hint">Nhập từ khóa để tìm kiếm bài viết...</div>';
    } else {
        overlay.classList.add('hidden');
        input.value = '';
        results.innerHTML = '';
        document.body.style.overflow = ''; // Restore scroll
    }
};

// Close search on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('search-overlay');
        if (overlay && !overlay.classList.contains('hidden')) {
            toggleSearch();
        }
    }

    // Open search with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
    }
});

// Close search when clicking outside
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('search-overlay');
    if (e.target === overlay) {
        toggleSearch();
    }
});

// Perform search
function performSearch(query) {
    const results = document.getElementById('search-results');

    if (!query || query.trim().length < 2) {
        results.innerHTML = '<div class="search-hint">Nhập ít nhất 2 ký tự để tìm kiếm...</div>';
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    const postsIndex = appState.config.postsIndex;

    // Search in title and category
    const matches = postsIndex.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 results

    if (matches.length === 0) {
        results.innerHTML = `
            <div class="search-no-results">
                <ion-icon name="search-outline" style="font-size: 3rem; opacity: 0.3;"></ion-icon>
                <p>Không tìm thấy kết quả cho "${query}"</p>
            </div>
        `;
        return;
    }

    results.innerHTML = matches.map(post => `
        <a href="/posts/${post.slug}" class="search-result-item" onclick="toggleSearch()">
            <img src="${post.image.startsWith('http') ? post.image : '/' + post.image}" 
                 alt="${post.title}" 
                 class="search-result-image"
                 onerror="this.src='/assets/logo.png'">
            <div class="search-result-content">
                <h4 class="search-result-title">${highlightMatch(post.title, searchTerm)}</h4>
                <div class="search-result-meta">
                    <span class="search-result-category">${post.category}</span>
                    <span> • ${post.date}</span>
                </div>
            </div>
        </a>
    `).join('');
}

// Highlight matched text
function highlightMatch(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark style="background: var(--sky-400); color: white; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// Debounce function to limit search calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize search input listener
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const debouncedSearch = debounce(performSearch, 300);
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
});

// ==========================================================================
// IMAGE LIGHTBOX FUNCTIONALITY
// ==========================================================================

function initImageLightbox() {
    const images = document.querySelectorAll('.markdown-body .article-img');

    images.forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(img.src, img.alt);
        });
    });
}

function openLightbox(src, alt) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'lightbox-overlay';

    // State for zoom and pan
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;

    lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
            <div class="lightbox-controls">
                <button class="lightbox-btn" id="zoom-out" title="Thu nhỏ">
                    <ion-icon name="remove-outline"></ion-icon>
                </button>
                <span class="lightbox-zoom-level">100%</span>
                <button class="lightbox-btn" id="zoom-in" title="Phóng to">
                    <ion-icon name="add-outline"></ion-icon>
                </button>
                <button class="lightbox-btn" id="zoom-reset" title="Reset">
                    <ion-icon name="scan-outline"></ion-icon>
                </button>
                <button class="lightbox-btn lightbox-close" id="lightbox-close" title="Đóng">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
            <div class="lightbox-image-container">
                <img src="${src}" alt="${alt || ''}" class="lightbox-image" draggable="false">
            </div>
            <p class="lightbox-caption">${alt || ''}</p>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Get elements
    const img = lightbox.querySelector('.lightbox-image');
    const zoomLevel = lightbox.querySelector('.lightbox-zoom-level');
    const container = lightbox.querySelector('.lightbox-image-container');

    function updateTransform() {
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        zoomLevel.textContent = Math.round(scale * 100) + '%';
    }

    function zoom(delta, centerX, centerY) {
        const oldScale = scale;
        scale = Math.min(Math.max(0.5, scale + delta), 5);

        // Adjust translation to zoom toward the center point
        if (centerX !== undefined && centerY !== undefined) {
            const rect = container.getBoundingClientRect();
            const offsetX = centerX - rect.width / 2;
            const offsetY = centerY - rect.height / 2;

            translateX -= offsetX * (scale / oldScale - 1);
            translateY -= offsetY * (scale / oldScale - 1);
        }

        updateTransform();
    }

    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    // Zoom buttons
    lightbox.querySelector('#zoom-in').addEventListener('click', (e) => {
        e.stopPropagation();
        zoom(0.25);
    });

    lightbox.querySelector('#zoom-out').addEventListener('click', (e) => {
        e.stopPropagation();
        zoom(-0.25);
    });

    lightbox.querySelector('#zoom-reset').addEventListener('click', (e) => {
        e.stopPropagation();
        resetZoom();
    });

    // Close button
    lightbox.querySelector('#lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

    // Mouse wheel zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        const rect = container.getBoundingClientRect();
        zoom(delta, e.clientX - rect.left, e.clientY - rect.top);
    });

    // Pan with mouse drag
    img.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            img.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        img.style.cursor = scale > 1 ? 'grab' : 'zoom-out';
    });

    // Touch support for pinch zoom
    let initialDistance = 0;
    let initialScale = 1;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialScale = scale;
        } else if (e.touches.length === 1 && scale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            scale = Math.min(Math.max(0.5, initialScale * (currentDistance / initialDistance)), 5);
            updateTransform();
        } else if (e.touches.length === 1 && isDragging) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        }
    });

    container.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Keyboard shortcuts
    function handleKeydown(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === '+' || e.key === '=') {
            zoom(0.25);
        } else if (e.key === '-') {
            zoom(-0.25);
        } else if (e.key === '0') {
            resetZoom();
        }
    }
    document.addEventListener('keydown', handleKeydown);

    // Double click to toggle zoom
    img.addEventListener('dblclick', () => {
        if (scale === 1) {
            scale = 2;
        } else {
            resetZoom();
        }
        updateTransform();
    });

    function closeLightbox() {
        document.removeEventListener('keydown', handleKeydown);
        lightbox.classList.add('closing');
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 200);
    }

    // Animate in
    requestAnimationFrame(() => {
        lightbox.classList.add('active');
    });
}

init();

