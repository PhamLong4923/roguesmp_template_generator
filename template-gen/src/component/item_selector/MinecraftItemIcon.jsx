import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const MinecraftItemIcon = ({ itemName, displayName }) => {
  // Vì file nằm ở /public/data/, Vite tự động hiểu đường dẫn gốc bắt đầu bằng /data/
  const expectedSrc = `../../../public/data/item_texture/minecraft_${itemName}.png`;
  const fallbackSrc = `../../../public/data/item_texture/minecraft_barrier.png`; // Giả định bạn có file minecraft_barrier.png

  const [imgSrc, setImgSrc] = useState(expectedSrc);
  const [isError, setIsError] = useState(false);

  // Reset lại state mỗi khi prop itemName thay đổi (khi user chuyển trang/search)
  useEffect(() => {
    setImgSrc(expectedSrc);
    setIsError(false);
  }, [itemName, expectedSrc]);

  // Handle lỗi 404 (Nếu item đó không có ảnh trong thư mục)
  const handleError = () => {
    if (!isError) {
      setImgSrc(fallbackSrc);
      setIsError(true);
    }
  };

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={displayName}
      onError={handleError}
      sx={{
        width: 40,
        height: 40,
        mb: 1.5,
        objectFit: 'contain',
        flexShrink: 0,
        imageRendering: 'pixelated', // Giữ nguyên độ sắc nét chuẩn Minecraft
        
        // Làm mờ và đổi màu xám nếu phải dùng ảnh fallback (barrier)
        ...(isError && {
          opacity: 0.3,
          filter: 'grayscale(100%)'
        })
      }}
    />
  );
};

export default MinecraftItemIcon;