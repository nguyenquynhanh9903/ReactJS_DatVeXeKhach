import { useContext, useState } from 'react';
import MyContext from '../config/MyContext';
import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from '../../Sidebar';
import { Link } from 'react-router-dom';


const TrangChu = () => {
    const [state] = useContext(MyContext)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [anchorE1, setAnchorE1] = useState(null)
    const {user} = state 

    const handleMenuClick = (event) => {
        setAnchorE1(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorE1(null);
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    }

    const menuItems = (
        <div>
            <List>
                <ListItem component={Link} to="/">
                    <ListItemText primary="Trang Chủ" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Quản lý nhân viên"/>
                </ListItem>
                <ListItem component={Link} to="/tuyenxe">
                    <ListItemText primary="Tuyến xe"/>
                </ListItem>
                {/* <ListItem component={Link} to="/add_tuyenxe">
                    <ListItemText primary="Thêm Tuyến xe"/>
                </ListItem> */}
                {/* <ListItem component={Link} to="/thongkedoanhthu">
                    <ListItemText primary="Thống Kê Doanh Thu"/>
                </ListItem> */}
                <Sidebar />
            </List>
        </div>
    )

    const isNhanVien = user && user.Loai_NguoiDung === 1;

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Trang Chủ
                    </Typography>

                    {isNhanVien && (
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1}}>
                            <Button
                                color="inherit"
                                onClick={handleMenuClick}
                            >
                                Quản Lý Nhân Viên
                            </Button>
                            <Menu
                                anchorEl={anchorE1}
                                open={Boolean(anchorE1)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleMenuClose} component={Link} to="/nhanvien">
                                    Danh Sách Nhân Viên
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} component={Link} to="/add_nv">
                                    Thêm Nhân Viên
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user !== null ? (
                            <>
                                <Button color="inherit" component={Link} to="/logout">
                                Đăng Xuất
                                </Button>
                            </>
                            ) : (
                            <div>
                                <Button color="inherit" component={Link} to="/login">
                                    Đăng Nhập
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Đăng Ký
                                </Button>
                            </div>
                        )}
                    </Box>
                </Toolbar>
                </AppBar>

                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {menuItems}
                </Drawer>

                <div style={{ padding: '20px' }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Chào Mừng Đến Với Trang Chủ {user?.username}
                </Typography>
                <Typography variant="h6" align="center">
                    Đây là nơi bạn có thể tìm thấy thông tin quan trọng và các dịch vụ mà chúng tôi cung cấp.
                </Typography>
                </div>
        </>
    )
}

export default TrangChu;