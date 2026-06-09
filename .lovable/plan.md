Một kế hoạch lớn gộp nhiều yêu cầu của bạn. Tôi tách thành các nhóm để dễ theo dõi.

## 1. Hero Banner data-driven + Editor Mode

- Tạo `src/data/heroSlides.ts` chứa mảng `slides: { id, type: 'image'|'video', image_url, video_url, title, subtitle }`.
- Refactor `HeroCarousel.tsx` để render từ mảng này. Mỗi slide:
  - Nếu `type='image'` → thẻ `<img src=...>` thật (visual-editable).
  - Nếu `type='video'` + YouTube → `<iframe>` nhúng.
  - Nếu `.mp4` → `<video loop muted autoplay playsinline>` thật.
- Thêm nút nhỏ "Quản trị Banner" (chỉ hiện khi `import.meta.env.DEV`). Bấm vào mở panel dọc liệt kê toàn bộ slide dưới dạng thumbnail `<img>`/`<video>` thật để dùng Visual Edits upload/đổi URL từng cái.

## 2. 4 ô sản phẩm dưới có `<img>` thật

Trong `ProductGrid.tsx`, 4 sản phẩm Cà phê / Tổ yến / Trà thảo mộc / Nước sâm hiện đang dùng placeholder div. Thay bằng `<img src={placeholderImg}>` với 4 file placeholder nhỏ trong `src/assets/` (`product-coffee.jpg`, `product-yensao.jpg`, `product-tra.jpg`, `product-sam.jpg`) để bạn click chọn và Upload file qua Visual Edits.

## 3. Mobile 2 cột cho Features & Products

- `Features.tsx`: đổi grid từ `sm:grid-cols-2 lg:grid-cols-4` → `grid-cols-2 lg:grid-cols-4` (mặc định 2 cột trên mobile).
- `ProductGrid.tsx`: đổi `sm:grid-cols-2 lg:grid-cols-4` → `grid-cols-2 lg:grid-cols-4`.
- Giảm padding card trên mobile để 4 ô khít trong 1 màn hình.

## 4. Section mới "HÀNH TRÌNH TINGO" (Video Carousel)

- Tạo `src/components/site/Journey.tsx` đặt ngay trên `Footer`, `id="journey"`.
- Data-driven: `journeySlides: { id, video_url, poster_url, title, caption }`. Mỗi slide render `<video controls src={video_url} poster={poster_url}>` thật để upload qua Visual Edits.
- Sửa nút "Xem Câu Chuyện" ở `Hero.tsx` link sang `#journey` (smooth scroll đã bật).

## 5. Cẩm nang → 4 Content Slot đa năng

Trong `Knowledge.tsx`, 4 mục con (article preview) liên kết xuống 4 slot `id="slot-1..4"`. Mỗi slot là 1 card với:
- `<img>` ảnh placeholder (upload được)
- Tiêu đề + đoạn mô tả (text-editable)
- `<video>` hoặc `<iframe>` placeholder cho YouTube URL.

## 6. Footer link động

Refactor `Footer.tsx`: mọi mục Địa chỉ / Chính sách / Liên hệ đổi thành `<a href="#">` với thuộc tính `href` để hiển thị field URL trong Visual Edits.

## 7. Search Overlay (Kính lúp)

- `src/components/site/SearchOverlay.tsx`: full-screen overlay, input lọc theo tên/giá/mô tả từ một `searchIndex` thống nhất (sản phẩm + bài cẩm nang).
- Kết quả hiển thị thumbnail + tên + giá, click scroll đến `#products` hoặc `#knowledge`.
- `Header.tsx`: nút kính lúp mở overlay (state local), ESC để đóng.

## 8. Login Modal với Google

- `src/components/site/LoginModal.tsx` dùng shadcn Dialog. Tabs: "Email/SĐT" + nút "Đăng nhập với Google" (icon Google SVG chuẩn).
- Chỉ là UI shell — chưa gọi backend (sẽ kích hoạt Lovable Cloud sau khi bạn xác nhận).
- `Header.tsx`: icon User mở modal.

## 9. Cart Counter + LocalStorage

- `src/hooks/useCart.tsx`: Context + reducer, `addItem(productId, qty)`, persist `localStorage`.
- Wrap app trong `CartProvider` tại `src/routes/__root.tsx`.
- Mọi nút "Thêm vào giỏ" trong `ProductGrid` & `Spotlight` gọi `addItem`.
- `Header.tsx`: badge số trên icon giỏ hàng, reactive theo tổng quantity.

## Technical details

- TanStack Start, file-based routing — không thêm route mới (overlay/modal là component).
- Editor Mode dùng `import.meta.env.DEV` để ẩn ở production.
- Không bật Lovable Cloud lần này — chỉ chuẩn bị UI cho Auth. Sẽ hỏi bạn trước khi bật.
- Tất cả ảnh/video dùng thẻ `<img>`/`<video>` chuẩn để Visual Edits nhận diện.

## Files

Tạo mới: `src/data/heroSlides.ts`, `src/data/journeySlides.ts`, `src/data/searchIndex.ts`, `src/components/site/Journey.tsx`, `src/components/site/SearchOverlay.tsx`, `src/components/site/LoginModal.tsx`, `src/components/site/BannerAdmin.tsx`, `src/hooks/useCart.tsx`, 4 ảnh placeholder sản phẩm.

Sửa: `HeroCarousel.tsx`, `Hero.tsx`, `ProductGrid.tsx`, `Features.tsx`, `Knowledge.tsx`, `Footer.tsx`, `Header.tsx`, `Spotlight.tsx`, `routes/index.tsx`, `routes/__root.tsx`.

Sau khi bạn duyệt, tôi sẽ triển khai theo thứ tự: data + carousel → grid/mobile → Journey → Knowledge slots → Footer → Search → Auth UI → Cart.