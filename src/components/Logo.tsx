import React, { useState } from 'react';

/**
 * Đường dẫn tới file logo, tính từ GỐC website.
 *
 * File nằm ở `public/Logo.png`. Vite chép nguyên thư mục `public/` sang `dist/`
 * mà KHÔNG đổi tên, KHÔNG gắn hash — nên thay logo chỉ là ghi đè đúng file đó,
 * không phải sửa dòng code nào. Hướng dẫn đầy đủ ở `LOGO.md` tại gốc dự án.
 *
 * (Cách còn lại là `import logo from '../assets/Logo.png'`. Vite sẽ gắn hash vào
 * tên file, tốt cho cache, nhưng đổi logo lại phải sửa import — trái với điều
 * đang cần ở đây.)
 */
const LOGO_SRC = '/Logo.png';

/** Chữ hiển thị khi chưa có file logo — cũng là văn bản thay thế cho screen reader. */
const WORDMARK = 'Lumiere';

interface LogoProps {
  /** Bấm vào logo để về trang chủ. Bỏ trống thì logo chỉ là hình, không bấm được. */
  onClick?: () => void;
  /**
   * Dùng thẻ <h1> thay vì <span>.
   *
   * Chỉ bật ở nơi logo THỰC SỰ là tiêu đề của trang (ReaderView). Mỗi trang chỉ
   * nên có một <h1>, nên thanh điều hướng dùng <span>.
   */
  heading?: boolean;
  className?: string;
}

/**
 * Logo Lumiere, dùng chung cho mọi nơi hiển thị thương hiệu.
 *
 * Gom về một component thay vì lặp thẻ <img>: kích thước, văn bản thay thế và
 * hành vi dự phòng nằm ở đúng một chỗ, nên đổi logo không phải đi tìm từng nơi.
 *
 * TỰ QUAY VỀ CHỮ khi chưa có file ảnh. Đây không phải phòng xa thừa: `public/`
 * chưa có `Logo.png` cho tới khi bạn thả file vào, và nếu không có nhánh dự
 * phòng thì thanh điều hướng sẽ hiện một ô ảnh vỡ thay cho tên site.
 */
export const Logo: React.FC<LogoProps> = ({ onClick, heading = false, className = '' }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const Tag = heading ? 'h1' : 'span';
  const interactive = onClick !== undefined;

  const content = imageFailed ? (
    <span className="font-display text-2xl font-bold tracking-tight text-[#cabeff]">
      {WORDMARK}
    </span>
  ) : (
    <img
      src={LOGO_SRC}
      alt={WORDMARK}
      /*
       * Khoá CHIỀU CAO, thả tự do chiều rộng: thanh điều hướng cao 64px nên chiều
       * cao là ràng buộc thật. Khoá chiều rộng sẽ bóp méo logo khi bạn đổi sang
       * file có tỉ lệ khác.
       */
      className="h-8 w-auto max-w-[180px] object-contain"
      onError={() => setImageFailed(true)}
    />
  );

  return (
    <Tag
      onClick={onClick}
      className={`flex items-center ${
        interactive ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
    >
      {content}
    </Tag>
  );
};
