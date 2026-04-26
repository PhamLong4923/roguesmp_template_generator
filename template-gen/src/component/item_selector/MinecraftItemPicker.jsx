import React, { useState, useMemo, useEffect } from 'react'; 

import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Card,
  Typography,
  Box,
  IconButton,
  Pagination,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MinecraftItemIcon from './MinecraftItemIcon';
import allItemsData from '../../public/data/items/_all.json';

const MINECRAFT_ITEMS = Object.keys(allItemsData).map((key, index) => ({
  id: index,
  name: key,
  displayName: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}));

const ITEMS_PER_PAGE = 25; 
const MinecraftItemPicker = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return MINECRAFT_ITEMS.filter((item) =>
      item.displayName.toLowerCase().includes(lowerQuery) ||
      item.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, page]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    const content = document.getElementById('item-dialog-content');
    if (content) content.scrollTop = 0;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" onClick={handleOpen}>
        Xem toàn bộ item 
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { height: "80vh" } }} // Set chiều cao cố định cho Dialog
      >
        {/* === PHẦN HEADER CỐ ĐỊNH (Không bị cuộn) === */}
        <Box sx={{ p: 2, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Vật phẩm Minecraft ({filteredItems.length})
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider />

        {/* === PHẦN NỘI DUNG CUỘN === */}
        <DialogContent
          id="item-dialog-content"
          sx={{ p: 2, bgcolor: "grey.50" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
                md: "repeat(5, 1fr)",
              },
              // Set gap cho grid và đảm bảo khoảng cách an toàn
              rowGap: 2.5,
              columnGap: 2,
            }}
          >
            {paginatedItems.map((item) => (
              <Card
                key={item.id}
                variant="outlined"
                sx={{
                  // Thêm margin y ~5px theo yêu cầu để chống đè
                  my: "10px",
                  height: "80%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  textAlign: "center",
                  p: 2,
                  bgcolor: "background.paper",
                  transition: "0.15s",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 2,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <MinecraftItemIcon  itemName={item.name} displayName={item.displayName} />

                <Typography
                  variant="body2"
                  fontWeight="600"
                  title={item.displayName}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.2,
                    mb: 0.5,
                    width: "100%",
                  }}
                >
                  {item.displayName}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ width: "100%", mt: "auto" }}
                  title={item.name}
                >
                  {item.name}
                </Typography>
              </Card>
            ))}
          </Box>

          {filteredItems.length === 0 && (
            <Typography align="center" sx={{ py: 6 }} color="text.secondary">
              Không tìm thấy item nào phù hợp.
            </Typography>
          )}
        </DialogContent>

        <Divider />

        {/* === PHẦN PHÂN TRANG === */}
        <Box
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "center",
            bgcolor: "background.paper",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="medium"
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default MinecraftItemPicker;