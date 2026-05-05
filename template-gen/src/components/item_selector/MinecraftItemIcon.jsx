import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

// Tải URL của tất cả các icon từ thư mục cục bộ (hỗ trợ tốt trong Vite dev và build)
const itemImages = import.meta.glob('../../public/data/item_texture/*.png', { eager: true, import: 'default' });
const blockImages = import.meta.glob('../../public/data/block_texture/*.png', { eager: true, import: 'default' });

const MinecraftItemIcon = ({ itemName, displayName }) => {
  const formattedName = itemName.startsWith('minecraft:') ? itemName.replace(':', '_') : `minecraft_${itemName}`;
  const itemImagePath = `../../public/data/item_texture/${formattedName}.png`;
  const blockImagePath = `../../public/data/block_texture/${formattedName}.png`;
  const barrierPath = `../../public/data/item_texture/minecraft_barrier.png`;

  const getInitialImage = () => {
    if (itemImages[itemImagePath]) return itemImages[itemImagePath];
    if (blockImages[blockImagePath]) return blockImages[blockImagePath];
    return itemImages[barrierPath];
  };

  const [imgSrc, setImgSrc] = useState(getInitialImage());
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setImgSrc(getInitialImage());
    setErrorCount(0);
  }, [itemName]);

  const handleError = () => {
    if (errorCount === 0) {
      setImgSrc(itemImages[barrierPath]);
      setErrorCount(1);
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
        imageRendering: 'pixelated', // Giữ nguyên độ sắc nét
        // Nếu load thất bại hoàn toàn, hiện một khối mờ để giữ form
        ...(errorCount === 1 && {
          opacity: 0.3,
          filter: 'grayscale(100%)'
        })
      }}
    />
  );
};

export default MinecraftItemIcon;