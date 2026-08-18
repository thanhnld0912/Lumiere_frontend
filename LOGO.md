# Logo và icon — thả file vào `public/`

> Ghi chú này để ở GỐC dự án, không để trong `public/`: mọi thứ nằm trong
> `public/` đều được xuất bản ra web, và một hướng dẫn nội bộ thì không cần ai
> trên Internet đọc.

Vite chép **nguyên xi** thư mục `public/` sang `dist/` khi build: giữ nguyên tên
file, không gắn hash, không nén lại. Nên **thay logo = ghi đè đúng file, không
sửa code**.

Đường dẫn trong code luôn bắt đầu bằng `/`, tính từ gốc website:
`public/logo.svg` → `<img src="/logo.svg">`.

## Cần những file nào

| File | Dùng ở đâu | Kích thước nên dùng | Bắt buộc |
|---|---|---|---|
| `logo.svg` | thanh điều hướng + trang đọc (`src/components/Logo.tsx`) | SVG, cao ~32px khi hiển thị | ✅ |
| `favicon.svg` | icon trên tab trình duyệt | SVG vuông | ✅ |
| `favicon.ico` | trình duyệt cũ không đọc SVG | 32×32 | nên có |
| `apple-touch-icon.png` | khi lưu trang vào màn hình chính iOS | 180×180 PNG | nên có |
| `og-image.png` | ảnh xem trước khi dán link lên Facebook/Discord | 1200×630 PNG | nên có |

Chưa có file nào thì trang **vẫn chạy bình thường**: `Logo.tsx` tự quay về hiển
thị chữ "Lumiere" khi không tải được ảnh.

## Nên dùng SVG cho logo

Nó sắc nét ở mọi độ phân giải và thường nhẹ hơn PNG cùng chất lượng. Nếu chỉ có
file PNG:

1. đặt tên `logo.png` và thả vào đây
2. sửa đúng **một dòng** ở đầu `src/components/Logo.tsx`:
   ```ts
   const LOGO_SRC = '/logo.png';
   ```

Logo nên có **nền trong suốt** — giao diện dùng nền tối `#101319`, logo nền trắng
sẽ hiện thành một khối trắng vuông trên thanh điều hướng.

## Đừng để ở đâu

- **`src/assets/`** — Vite gắn hash vào tên file (`logo-a3f9c1.svg`) và bắt phải
  `import`. Tốt cho cache, nhưng đổi logo lại phải sửa import, trái với điều đang
  cần ở đây.
- **Nhúng base64 thẳng vào code** — mỗi lần đổi logo là một diff khổng lồ không
  ai đọc được.
