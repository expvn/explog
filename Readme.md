# Hướng dẫn Sử dụng & Phát triển EXPLog CMS

> [!INFO] Giới thiệu
> Đây là tài liệu hướng dẫn chi tiết dành cho **EXPLog CMS** - một hệ thống quản lý nội dung dạng file (File-based), không cần Database, siêu nhẹ và dễ tùy biến.

## 1. Cấu trúc Dự án & Chuyên môn

Hiểu rõ từng file giúp bạn làm chủ hệ thống:

- **`content/posts/`**: **Kho nội dung**. Chứa các file Markdown (`.md`).
    - Hỗ trợ thư mục con (VD: `posts/tech/review.md`).
- **`assets/`**: **Kho tài nguyên**. Chứa ảnh, logo.
    - `assets/banner/`: Chứa ảnh slide trang chủ.
- **`scripts/generate-config.js`**: **Bộ xử lý trung tâm**.
    - Script này quét toàn bộ file `.md`, đọc metadata, tạo menu từ category.
    - Xuất ra file `config.json`.
- **`config.json`**: **Database tĩnh**.
    - Frontend đọc file này để hiển thị bài viết.
- **`app.js`**: **Frontend Controller (SPA)**.
    - Quản lý Routing (chuyển trang).
    - Render HTML từ dữ liệu JSON.
- **`index.html`**: **Giao diện chính**.
- **`style.css`**: **Giao diện & Style**.

---

## 2. Quy trình Phát triển (Localhost)

Để chạy dự án và viết bài trên máy tính cá nhân:

1.  **Cài đặt** (chỉ làm lần đầu):
    ```bash
    npm install
    ```
2.  **Chế độ làm việc**:
    - **Bước 1**: Viết bài hoặc sửa code.
    - **Bước 2**: Build lại dữ liệu.
        ```bash
        npm run build
        ```
    - **Bước 3**: Xem thử (Preview).
        ```bash
        npm start
        ```
    *(Mở trình duyệt tại `http://127.0.0.1:8081`)*

---

## 3. Quản trị Giao diện (UI/UX)

### Thay đổi Màu sắc & Font
- Mở file `style.css`.
- Chỉnh sửa các biến CSS (CSS Variables) ở đầu file (`:root`):
    ```css
    :root {
        --primary: #1DA1F2; /* Màu chủ đạo */
        --bg: #FBFDFF;      /* Màu nền */
    }
    ```

### Chỉnh sửa Bố cục (Layout)
- **Header/Footer**: Sửa trực tiếp trong `index.html`.
- **Lưới bài viết (Grid)**: Sửa hàm `renderHome()` trong `app.js`.
- **Chi tiết bài viết**: Sửa hàm `loadContent()` trong `app.js`.
- **Giao diện bài viết (Markdown)**: Sửa class `.markdown-body` trong `style.css`.

---

## 4. Quản trị Nội dung (CMS)

### Thêm Bài Viết Mới
1.  Tạo file `.md` mới trong `content/posts/`. Ví dụ: `content/posts/my-story.md`.
2.  Thêm **Frontmatter** vào đầu file:
    ```yaml
    ---
    title: "Tiêu đề bài viết"
    date: "2025-12-12"
    category: "Life"
    image: "assets/hero.png"
    summary: "Mô tả ngắn gọn về bài viết..."
    ---
    Nội dung bài viết bắt đầu tại đây...
    ```
3.  Chạy `npm run build` để cập nhật.

### Thêm Hình ảnh
- **Cách 1 (Khuyên dùng)**: Để ảnh cùng thư mục với file `.md` (nếu để mỗi bài 1 thư mục).
- **Cách 2**: Để ảnh vào `assets/` rồi dẫn link `assets/ten-anh.png`.

---

## 5. Quản trị Menu & Trang

Hệ thống tự động tạo Menu dựa trên **Category**.

- **Thêm Menu mới**: Chỉ cần đặt `category: "Tên-Mới"` trong bài viết. Khi build, menu sẽ tự hiện.
- **Tùy biến nâng cao**:
    - Mở `scripts/generate-config.js`.
    - Tìm đoạn `const menu = ...` để thêm các link cố định (VD: Link sang Web khác, Link giới thiệu tĩnh).

---

## 6. Cấu hình Trang Chủ

Mặc định trang chủ hiện tất cả bài mới nhất.

### Lọc bài viết hiển thị
Sửa file `config.json` (hoặc sửa cứng trong `generate-config.js`):
```json
"home": {
  "categories": ["Tech", "Design"], 
  "limit": 6
}
```

### Chinh sửa Slider (Hero Banner)
- Copy ảnh vào thư mục `assets/banner/`.
- Chạy `npm run build`.
- Hệ thống tự động nhận diện và tạo slider từ các ảnh trong đó.

---

## 7. Deploy (Vercel)

Dự án này là **Static Site**, cực kỳ dễ deploy.

1.  Đẩy code lên **GitHub**.
2.  Kết nối với **Vercel**.
3.  Cấu hình Build:
    - **Build Command**: `npm run build`
    - **Output Directory**: `.` (Root)
4.  Nhấn **Deploy**.

> [!TIP] Mẹo
> Mỗi khi bạn viết bài xong và push lên GitHub, Vercel sẽ tự động chạy lệnh build để cập nhật bài viết mới lên website của bạn ngay lập tức.
