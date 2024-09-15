import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../config/API";
import { Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { DropzoneArea } from "mui-file-dropzone";

const SuaKhachHang = () => {
    const nav = useNavigate();
    const { id_KH } = useParams();
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [ngaySinh, setNgaySinh] = useState('');
    const [gioiTinh, setGioiTinh] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [cmnd, setCMND] = useState('');
    const [dienThoai, setDienThoai] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [newAvatar, setNewAvatar] = useState(null);
    const [userID, setUserID] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect (() => {
        KhachHangData()
    }, [id_KH])

    const KhachHangData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                const response = await API.get(`${endpoints['khachhang']}?makhach=${id_KH}`, { headers });
                const data = response.data.results;
                if (data && data.length > 0) {
                    const c = data[0];
                    setID(c.id);
                    setName(c.Ten_KH);
                    setNgaySinh(c.NgaySinh);
                    setGioiTinh(c.GioiTinh);
                    setDiaChi(c.DiaChi);
                    setCMND(c.CMND);
                    setDienThoai(c.DienThoai);
                    setEmail(c.Email);
                    setAvatar(c.avatar);
                    setUserID(c.user);
                }
            } else {
                alert('Bạn có phải là Quản Lý!! Vui lòng đăng nhập đúng tài khoản!');
                nav('/login'); // Redirect to login if no token
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin khách hàng:', error);
        } finally {
            setLoading(false);
        }
        
    }

    const handleImageUpload = (files) => {
        const file = files[0]
        if (file) {
            setNewAvatar(file)
        }
    }

    const suaKhachHang = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('Token không tìm thấy');

            const formData = new FormData();
            formData.append('id', id);
            formData.append('Ten_taixe', name);
            formData.append('NgaySinh', ngaySinh);
            formData.append('GioiTinh', gioiTinh);
            formData.append('DiaChi', diaChi);
            formData.append('CMND', cmnd);
            formData.append('DienThoai', dienThoai);
            formData.append('Email', email);
            formData.append('user', userID);
        

            if (newAvatar) {
                formData.append('avatar', newAvatar);
            } else if (avatar) {
                formData.append('avatar', avatar);
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            await API.put(`${endpoints['khachhang']}${id_KH}/Sua_KH/`, formData, { headers });
            await KhachHangData();
            nav('/khachhang');
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin khách hàng:', error);
            alert('Lỗi khi cập nhật thông tin khách hàng!!!');
        }
        setLoading(false);
    }

    return (
        <>
            <Container>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Cập Nhật Thông Tin Khách Hàng
                        </Typography>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Tên khách hàng"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Ngày Sinh"
                            value={ngaySinh}
                            onChange={(e) => setNgaySinh(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Giới Tính"
                            value={gioiTinh}
                            onChange={(e) => setGioiTinh(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Địa Chỉ"
                            value={diaChi}
                            onChange={(e) => setDiaChi(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="CMND"
                            value={cmnd}
                            onChange={(e) => setCMND(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Điện Thoại"
                            value={dienThoai}
                            onChange={(e) => setDienThoai(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Box sx={{ my: 3 }}>
                            <Typography variant="h6">Chọn ảnh đại diện:</Typography>
                            <DropzoneArea
                                acceptedFiles={['image/*']}
                                onChange={handleImageUpload}
                                showPreviews
                                showPreviewsInDropzone={false}
                            />
                            {newAvatar && (
                                <img
                                    src={URL.createObjectURL(newAvatar)}
                                    alt="Preview"
                                    style={{ width: 200, height: 200, marginTop: 10 }}
                                />
                            )}
                            {avatar && !newAvatar && (
                                <img
                                    src={avatar}
                                    alt="Current Avatar"
                                    style={{ width: 200, height: 200, marginTop: 10 }}
                                />
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button variant="contained" color="secondary" onClick={() => nav('/khachhang')}>
                                Quay Lại
                            </Button>
                            <Button variant="contained" color="primary" onClick={suaKhachHang}>
                                Cập nhật
                            </Button>
                        </Box>
                    </Box>
                )}
            </Container>
        </>
    )
}

export default SuaKhachHang;