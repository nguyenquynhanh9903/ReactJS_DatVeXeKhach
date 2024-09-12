import { useEffect } from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API, { endpoints } from "../../config/API"
import { Alert, Button, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Snackbar, Typography } from "@mui/material"

const TaiXeDetail = () => {
    const { id } = useParams()
    const [nhanvien, setNhanVien] = useState(null)
    const [loading, setLoading] = useState(true)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success')
    const nav = useNavigate()

    useEffect(() => {
        const loadTaiXeDeatail = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('access_token');
                if (token) {
                  const headers = {
                    Authorization: `Bearer ${token}`
                  };
                  const res = await API.get(`${endpoints['taixe']}?mataixe=${id}`, { headers });
                  setNhanVien(res.data.results);
                } else {
                  console.log("Không tìm thấy dữ liệu!!!");
                }
            } catch (error) {
                console.error(error);
                setSnackbarMessage('Đã xảy ra lỗi khi tải thông tin tài xế !');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        }

        loadTaiXeDeatail();

    }, [id])

    const XoaTaiXe = async () => {
        setSnackbarMessage('Bạn có chắc chắn muốn xóa tài xế này?');
        setSnackbarSeverity('info');
        setOpenSnackbar(true);
        const confirm = window.confirm('Bạn có chắc chắn muốn xóa tài xế này?');
        if (confirm) {
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                let headers = {
                    Authorization: `Bearer ${token}`
                };
                const res = await API.delete(`${endpoints['taixe']}${id}/Xoa_TX/`, { headers });
                if (res.status === 204) {
                    setSnackbarMessage('Xóa thành công');
                    setSnackbarSeverity('success');
                    nav('/taixe');
                } else {
                    setSnackbarMessage('Lỗi! Bạn có phải là Quản Lý ?');
                    setSnackbarSeverity('error');
                }
                } else {
                setSnackbarMessage('Lỗi! Không thể xóa tài xế!!');
                setSnackbarSeverity('error');
                }
            } catch (error) {
                console.error('Error:', error);
                setSnackbarMessage('Đã xảy ra lỗi khi xóa tài xế !');
                setSnackbarSeverity('error');
            }
        }
    }

    const quayLai = () => {
        nav('/taixe')
    }

    const suaTaiXe = (id_TaiXe) => {
        nav('/sua_taixe/${id_TaiXe}')
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }

    if (loading) {
        return(
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        )
    }

    return (
        <>
            <Container maxWidth="md" style={{ padding: '20px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    THÔNG TIN TÀI XẾ
                </Typography>
                {nhanvien && nhanvien.map(c => (
                    <Card key={c.id} style={{ marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                        <CardMedia
                            component="img"
                            alt="Avatar"
                            height="200"
                            image={c.avatar}
                            style={{
                            objectFit: 'cover',
                            borderRadius: '50%', 
                            width: '250px',     
                            height: '250px',   
                            margin: '0 auto',   
                            display: 'block'  
                            }}
                        />
                        <CardContent style={{ textAlign: 'center' }}>
                            <Typography variant="h5" style={{ color: '#1976d2', marginBottom: '8px' }}>
                            Tên: {c.Ten_taixe}
                            </Typography>
                            <Typography variant="body1" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Mã tài xế: {c.id}</Typography>
                            <Typography variant="body1" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Ngày Sinh: {c.NgaySinh}</Typography>
                            <Typography variant="body1" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Giới Tính: {c.GioiTinh}</Typography>
                            <Typography variant="body1" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Địa chỉ: {c.DiaChi}</Typography>
                            <Typography variant="body1" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Email: {c.Email}</Typography>
                            <Typography variant="body1" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>CMND: {c.CMND}</Typography>
                            <Typography variant="body1" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Số điện thoại: {c.DienThoai}</Typography>
                        </CardContent>
                        <CardContent>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <Button variant="contained" color="secondary" onClick={quayLai}>
                                    Quay lại
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={() => suaTaiXe(c.id)} >
                                    Sửa
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="error" onClick={XoaTaiXe}>
                                    Xóa
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
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
        </>
    )
}

export default TaiXeDetail;