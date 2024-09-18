import axios from "axios";
import API, { BASE_URL, endpoints } from "../../config/API";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, CardContent, CardMedia, Container, Grid, Snackbar, TextField, Typography } from "@mui/material";

const ThemKhachHang = () => {
    const [name, setName] = useState('');
    const [ngaySinh, setNgaySinh] = useState('');
    const [gioiTinh, setGioiTinh] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [cmnd, setCMND] = useState('');
    const [dienThoai, setDienThoai] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const nav = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [listUser, setListUser] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const blobUrl = URL.createObjectURL(file)
            setAvatarUrl(blobUrl)
            setAvatar(file)
        }
    }

    useEffect (() => {
        const fetchUsers = async () => {
            try {
                const response = await API.get(endpoints['list_user']);
                setListUser(response.data);
              } catch (error) {
                console.error('Failed to fetch user list:', error.message);
              }
        }
        fetchUsers();
    }, [])

    const findUserId = (name) => {
        const nameParts = name.trim().split(' '); 
        if (nameParts.length >= 2) {
        const firstName = nameParts[0]; // Tên đầu tiên
        const lastName = nameParts.slice(1).join(' '); // Tên còn lại
        console.log(listUser);
        const foundUser = listUser.find(user => 
            user.first_name === firstName.trim().toString() && user.last_name === lastName.trim().toString()
        );
        return foundUser ? foundUser.id : null;
        }

        const foundUser = listUser.find(user => 
        `${user.firstName} ${user.lastName}` === name
        );

        return foundUser ? foundUser.id : null;
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }

    const themKhachHang = async () => {
        try {
        
            const list = await API.get(endpoints['list_user']);
            setListUser(list);
    
            if (!name || !ngaySinh || !gioiTinh || !diaChi || !cmnd|| !dienThoai || !email || !avatar) {
              setSnackbarMessage('Vui lòng nhập đầy đủ thông tin và chọn ảnh đại diện');
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              return;
            }
    
            const userId = findUserId(name); 
            console.log(userId);
    
            if (!userId) {
              setSnackbarMessage('Không tìm thấy người dùng này !!');
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
              return;
            }
    
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('Ten_KH', name);
            formData.append('NgaySinh', ngaySinh);
            formData.append('GioiTinh', gioiTinh);
            formData.append('DiaChi', diaChi);
            formData.append('CMND', cmnd);
            formData.append('DienThoai', dienThoai);
            formData.append('Email', email);
            formData.append('avatar', avatar);
            formData.append('user', userId)
    
            const response = await axios.post(BASE_URL + endpoints['them_KH'], formData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            })

            if (response.status === 201) {
                setSnackbarMessage('Thêm thành công. Bạn vui lòng quay lại trang Khách Hàng để xem sự thay đổi.');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                nav('/khachhang')
                setName('');
                setNgaySinh('');
                setGioiTinh('');
                setDiaChi('');
                setCMND('');
                setDienThoai('');
                setEmail('');
                setAvatar('');
            }
        } catch (error) {
            setSnackbarMessage('Đã xảy ra lỗi khi thêm khách hàng');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
        
    }

    return (
        <>
            <div style={{backgroundColor: 'blue'}}>
                <Container component="main" maxWidth="xs" className="container1">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" style={{marginLeft: 75}}>Thêm Khách Hàng</Typography>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Họ và tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Ngày sinh"
                                value={ngaySinh}
                                onChange={(e) => setNgaySinh(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Giới tính"
                                value={gioiTinh}
                                onChange={(e) => setGioiTinh(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Địa chỉ"
                                value={diaChi}
                                onChange={(e) => setDiaChi(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="CMND"
                                value={cmnd}
                                onChange={(e) => setCMND(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Điện thoại"
                                value={dienThoai}
                                onChange={(e) => setDienThoai(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {avatarUrl && (
                                <CardMedia
                                component="img"
                                image={avatarUrl}
                                alt="Avatar"
                                style={{ width: '100%', height: 'auto', marginTop: 10 }}
                                />
                            )}
                            <Grid container spacing={2} justifyContent="center" marginTop={2}>
                                <Grid item>
                                    <Button variant="contained" color="secondary" onClick={() => nav('/khachhang')}>
                                        Quay Lại
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={themKhachHang}>
                                        Thêm khách hàng
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Container>
            </div>
        </>
    )
}

export default ThemKhachHang;