# EXPLog CMS

<div align="center">

![EXPLog CMS](assets/logo.png)

**Lightweight File-based CMS - Không cần Database, Siêu nhẹ, Dễ tùy biến**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

</div>

---

## 🌟 Giới thiệu

**EXPLog CMS** là hệ thống quản lý nội dung dạng file (File-based CMS) được thiết kế cho các blog cá nhân, portfolio, và website giới thiệu sản phẩm. Không cần database, hosting đơn giản, deploy miễn phí trên Vercel/Netlify.

### Tại sao chọn EXPLog?

| Ưu điểm | Mô tả |
|---------|-------|
| 🚀 **Siêu nhanh** | Static site + Service Worker caching, load gần như tức thì |
| 💰 **Miễn phí hosting** | Deploy miễn phí trên Vercel, Netlify, GitHub Pages |
| 📝 **Markdown** | Viết bài bằng Markdown với syntax highlighting |
| 🔍 **SEO tối ưu** | Meta tags động, sitemap.xml, robots.txt tự động |
| 📱 **Responsive** | Giao diện đẹp trên mọi thiết bị |
| ⚡ **Không database** | Nội dung lưu dạng file, dễ backup và migrate |

---

## ✨ Tính năng

### 📰 Quản lý Bài viết
- Viết bài bằng **Markdown** với frontmatter YAML
- Tự động tạo **summary** từ nội dung nếu không khai báo
- Phân loại theo **Category** và **Tags**
- **Pagination** với lazy loading (tải trang theo yêu cầu)
- **Related posts** hiển thị bài viết cùng category
- **Navigation** (Newer/Older) giữa các bài viết

### 🖼️ Hình ảnh & Media
- **Image lightbox**: Click vào ảnh để xem fullscreen với zoom
  - Zoom bằng scroll wheel / pinch-to-zoom (mobile)
  - Pan/drag khi đã zoom
  - Double-click để toggle zoom 100%/200%
  - Keyboard: `+/-` zoom, `0` reset, `Esc` đóng
- **Video embedding**: Tự động nhúng YouTube và file video (.mp4, .webm)
- **Hero slider**: Trang chủ với banner slideshow tự động

### 💻 Code & Developer
- **Syntax highlighting** với highlight.js
- **Copy button** với feedback animation ("✓ Copied!")
- Hỗ trợ 180+ ngôn ngữ lập trình

### 🔍 Tìm kiếm
- **Real-time search** với highlight kết quả
- Tìm kiếm theo tiêu đề và nội dung
- Debounce để tối ưu performance

### 📄 Custom Pages

| Loại trang | Route | Mô tả |
|------------|-------|-------|
| **Customize** | `/c/tên-page` | Trang có bố cục grid (giống Category) |
| **Embedded** | `/e/tên-page` | Trang tĩnh nhúng trong layout chính |
| **Standalone** | `/s/tên-page` | Trang độc lập fullscreen (games, apps) |

- Hỗ trợ WebGL, forms, và ứng dụng tương tác
- Mỗi page có file `page.json` để cấu hình metadata

### 🔎 SEO & Performance
- **Dynamic meta tags**: Title, description cập nhật theo từng trang
- **Open Graph**: Tối ưu chia sẻ Facebook/LinkedIn
- **Twitter Cards**: Tối ưu chia sẻ Twitter
- **JSON-LD**: Structured data cho Google
- **Sitemap.xml**: Tự động tạo với tất cả URLs
- **Robots.txt**: Hướng dẫn bot tìm kiếm
- **Service Worker**: Cache offline, tải nhanh hơn

### 🎨 Giao diện
- **Bootstrap 5** responsive framework
- **CSS Variables** dễ tùy biến màu sắc
- **Dark mode ready** (có thể mở rộng)
- **Ionicons** icon library

---

## 📁 Cấu trúc Dự án

```
explog/
├── content/
│   ├── posts/              # Bài viết Markdown
│   │   └── ten-bai-viet/
│   │       ├── index.md    # Nội dung bài viết
│   │       └── images/     # Hình ảnh của bài
│   └── pages/              # Trang tĩnh
│       ├── Customize/      # Trang grid layout (/c/...)
│       ├── Embedded/       # Trang nhúng trong layout (/e/...)
│       └── Standalone/     # Trang độc lập (/s/...)
├── assets/
│   ├── logo.png            # Logo website
│   └── banner/             # Ảnh slider trang chủ
├── config/                 # Config tự động tạo bởi build
│   ├── site.json           # Thông tin website
│   ├── hero.json           # Cấu hình slider
│   ├── menu.json           # Menu navigation
│   ├── categories.json     # Danh sách category
│   ├── tags.json           # Danh sách tags
│   ├── posts-index.json    # Index tất cả bài viết
│   └── posts/              # Chi tiết bài viết phân trang
├── scripts/
│   └── generate-config.js  # Script build config
├── app.js                  # Frontend SPA logic
├── style.css               # Stylesheet
├── sw.js                   # Service Worker (caching)
├── index.html              # Entry point
├── sitemap.xml             # Sitemap tự động
├── robots.txt              # Robots.txt tự động
├── vercel.json             # Cấu hình Vercel
└── serve.json              # Cấu hình local server
```

---

## 🚀 Bắt đầu

### Yêu cầu
- [Node.js](https://nodejs.org/) v16+ 
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone https://github.com/expvn/explog.git
cd explog

# Cài đặt dependencies
npm install

# Build config
npm run build

# Chạy local server
npm start
```

Mở trình duyệt tại `http://localhost:8081`

---

## ✍️ Viết Bài

### Tạo bài viết mới

1. Tạo thư mục trong `content/posts/`:
```
content/posts/ten-bai-viet/
├── index.md
└── images/
    └── cover.jpg
```

2. Thêm frontmatter vào `index.md`:
```yaml
---
title: "Tiêu đề bài viết"
date: "2025-12-17"
category: "Blog"
tags: ["tag1", "tag2"]
author: "Tên tác giả"
image: "images/cover.jpg"
summary: "Mô tả ngắn về bài viết..."
---

# Nội dung bài viết

Bắt đầu viết nội dung ở đây...
```

3. Build lại config:
```bash
npm run build
```

### Nhúng Media

**Hình ảnh** (click để xem fullscreen):
```markdown
![Mô tả ảnh](images/my-image.jpg)
```

**Video YouTube**:
```markdown
[Xem video](https://youtube.com/watch?v=VIDEO_ID)
```

**Video file**:
```markdown
[Xem video](video.mp4)
```

---

## ⚙️ Cấu hình

### 🎯 Cá nhân hóa Website (`config/site.json`)

Đây là file duy nhất bạn cần chỉnh sửa để cá nhân hóa CMS:

```json
{
  "siteTitle": "Tên Website",
  "siteName": "Tên ngắn (navbar/footer)",
  "siteUrl": "https://your-domain.com",
  "logo": "assets/logo.png",
  "favicon": "assets/logo.png",
  "description": "Mô tả website của bạn",
  "keywords": "từ khóa, seo, tìm kiếm",
  "author": "Tên tác giả",
  "language": "vi",
  "postsPerPage": 20,
  "footer": {
    "copyright": "© 2025 Tên Website. All rights reserved.",
    "showLogo": true
  },
  "social": {
    "github": "https://github.com/username",
    "twitter": "",
    "facebook": ""
  }
}
```

| Trường | Mô tả |
|--------|-------|
| `siteTitle` | Tên đầy đủ của website (hiển thị trong title) |
| `siteName` | Tên ngắn (hiển thị trong navbar và footer) |
| `siteUrl` | Domain website (dùng cho SEO, sitemap) |
| `description` | Mô tả website (SEO) |
| `keywords` | Từ khóa (SEO) |
| `footer.copyright` | Text copyright ở footer |

### Trang chủ (`config/home.json`)
```json
{
  "categories": ["Blog", "Tech"],  // Lọc category hiển thị
  "limit": 12                       // Số bài tối đa
}
```

### Hero Slider (`config/hero.json`)
```json
{
  "enabled": true,
  "slides": [
    { "image": "assets/banner/slide1.jpg", "link": "/posts/bai-viet-1" },
    { "image": "assets/banner/slide2.jpg", "link": "/posts/bai-viet-2" }
  ]
}
```

### Menu (`config/menu.json`)
```json
[
  { "title": "BLOG", "path": "category/blog" },
  { "title": "GAME", "path": "category/game" },
  { "title": "ABOUT", "path": "page/about" }
]
```

### Custom Pages

Các trang tùy chỉnh được đặt trong `content/pages/` với 3 loại:

#### Customize Pages (`/c/tên-page`)

Tạo thư mục trong `content/pages/Customize/`:
```
content/pages/Customize/expgames/
├── page.json          # Cấu hình trang
├── cover1.jpg         # Hình ảnh
├── cover2.jpg
└── ...
```

File `page.json`:
```json
{
    "title": "EXPGAMES",
    "description": "Các game do EXPVN phát triển",
    "type": "customize",
    "content": [
        {
            "cover": "content/pages/Customize/expgames/cover1.jpg",
            "title": "Game 1",
            "description": "Mô tả game",
            "path": "content/pages/Embedded/game-1/"
        }
    ]
}
```

#### Embedded Pages (`/e/tên-page`)

Trang nhúng trong layout chính:
```
content/pages/Embedded/test-page/
├── page.json
└── index.html (hoặc view.html)
```

#### Standalone Pages (`/s/tên-page`)

Trang độc lập hiển thị fullscreen:
```
content/pages/Standalone/landing/
├── page.json
└── index.html
```

---

## 🌐 Deploy

### Vercel (Khuyên dùng)

1. **Push code lên GitHub**

2. **Kết nối Vercel**:
   - Đăng nhập [vercel.com](https://vercel.com)
   - Import repository từ GitHub

3. **Cấu hình**:
   | Setting | Value |
   |---------|-------|
   | Build Command | `npm run build` |
   | Output Directory | `.` |
   | Install Command | `npm install` |

4. **Deploy** → Website sẽ tự động cập nhật mỗi khi push code

### Netlify

1. **Kết nối repository**:
   - Đăng nhập [netlify.com](https://netlify.com)
   - New site from Git → Chọn repo

2. **Cấu hình**:
   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Publish directory | `.` |

3. **Tạo `_redirects` file** (trong root):
   ```
   /*    /index.html   200
   ```

### GitHub Pages

1. **Tạo branch `gh-pages`**:
   ```bash
   npm run build
   git add -A
   git commit -m "Build"
   git subtree push --prefix . origin gh-pages
   ```

2. **Cấu hình GitHub**:
   - Settings → Pages → Source: `gh-pages` branch

3. **Lưu ý**: Cần tạo file `404.html` copy từ `index.html` để SPA routing hoạt động

### Self-hosted (VPS/Server)

1. **Upload files** lên server

2. **Nginx config**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/explog;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /content/ {
           try_files $uri =404;
       }
   }
   ```

3. **Apache config** (`.htaccess`):
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^content/ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

---

## 🎨 Tùy biến Giao diện

### Thay đổi Màu sắc

Mở `style.css` và chỉnh sửa CSS Variables:

```css
:root {
    --sky-600: #1DA1F2;        /* Màu primary */
    --sky-400: #66C3FF;        /* Màu primary light */
    --hotpink-700: #E11D74;    /* Màu accent */
    --bg: #FBFDFF;             /* Màu nền */
    --card: #FFFFFF;           /* Màu card */
    --muted: #6B7280;          /* Màu text phụ */
    --border: #E6EEF8;         /* Màu border */
    --radius-base: 14px;       /* Bo góc */
    --container: 1180px;       /* Độ rộng container */
}
```

### Thay đổi SEO Domain

Mở `app.js` và tìm:
```javascript
const SEO = {
    baseUrl: 'https://expvn.com',  // ← Đổi thành domain của bạn
    ...
}
```

Mở `scripts/generate-config.js` và tìm:
```javascript
const BASE_URL = 'https://expvn.com';  // ← Đổi thành domain của bạn
```

---

## 📋 Scripts

| Command | Mô tả |
|---------|-------|
| `npm install` | Cài đặt dependencies |
| `npm run build` | Build config từ content |
| `npm start` | Chạy local server port 8081 |

---

## 🔧 Tech Stack

- **Frontend**: Vanilla JavaScript (SPA)
- **Styling**: CSS3 + Bootstrap 5
- **Markdown**: marked.js + DOMPurify
- **Syntax Highlighting**: highlight.js
- **Copy**: clipboard.js
- **Icons**: Ionicons
- **Build**: Node.js + gray-matter + glob

---

## 📄 License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.

---

## 🤝 Contributing

Pull requests are welcome! Vui lòng tạo issue trước khi gửi PR lớn.

---

<div align="center">

**Made with ❤️ by EXPVN**

[Website](https://expvn.com) • [GitHub](https://github.com/expvn)

</div>
