import './StyleRegis.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Alert, Button, styled, TextField, Typography } from "@mui/material";
import API, { endpoints } from '../../config/API';
import { FloatingLabel, Form } from 'react-bootstrap';

const RegisterAdmin = () => {
    const [user, setUser] = useState({Loai_NguoiDung: 3})
    const [err, setErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] =  useState(null)
    const [avatarUrl, setAvatarUrl] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const nav = useNavigate()

    const fields = [
        {label: "Họ và tên lót", name: "last_name"},
        {label: "Tên", name: "first_name"},
        {label: "Tên đăng nhập", name: "username"},
        {label: "Email", name: "email"},
        {label: "Mật khẩu", name: "password", type: "password"},
        {label: "Xác nhận mật khẩu", name: "confirm_password", type: "password"},
    ]

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles, rejectedFiles) => {
            console.log('Accepted files:', acceptedFiles);
            console.log('Rejected files:', rejectedFiles);

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(file => {
                    console.error(`File ${file.file.name} bị từ chối vì: ${file.errors.map(e => e.message).join(', ')}`);
                });
                return;
            }

            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                console.log('File type:', file.type);
                setAvatar(file);
                setAvatarUrl(URL.createObjectURL(file));
            }
        },
    });

    const handleRegister = async () => {
        if (user.password !== user.confirm_password) {
            setErr(true);
            return;
        }

        setErr(false);
        setLoading(true);

        const formData = new FormData();
        for (let key in user) {
            if (key !== 'confirm_password') {
                formData.append(key, user[key]);
            }
        }

        if (avatar) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (validImageTypes.includes(avatar.type)) {
                formData.append('avatar', avatar);
            } else {
                console.error('Invalid file type:', avatar.type);
            }
        }

        try {
            const res = await API.post(endpoints['register'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                setSuccessMessage('Đăng ký thành công!');
                setTimeout(() => nav("/home"), 3000); 
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }

    const handleSelect = (e) => {
        setUser({...user, Loai_NguoiDung: e.target.value})
    }


    return (
        <>
            <div style={{padding: '20px', maxWidth: '600px', margin: 'auto'}}>
            <h1 style={{ marginTop: '80px', marginBottom: '50px', textAlign: 'center' }}
            >ĐĂNG KÝ</h1>
                
                {fields.map((field) => (
                    <StyledInput
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.type || 'text'}
                        value={user[field.name] || ''}
                        onChange={handleChange}
                        fullWidth
                    />
                ))}
                
                <FloatingLabel 
                    controlId="floatingSelect" 
                    label="Vui lòng chọn người dùng!"
                    className="mb-3"
                >
                    <Form.Select 
                        aria-label="Floating label select example"
                        onChange={handleSelect}  //Thêm sự kiện onChange để cập nhật Loai_NguoiDung
                        value={user.Loai_NguoiDung}  //Liên kết giá trị từ state
                    >
                        <option value="1">Admin</option>
                        <option value="2">Nhân viên</option>
                        <option value="3">Tài xế</option>
                    </Form.Select>
                </FloatingLabel>

                {err && <Alert severity="error">Mật khẩu không khớp!</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}

                <div
                    {...getRootProps()}
                    style={{
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        marginBottom: '20px',
                        paddingTop: '20px',
                    }}
                >
                    <input {...getInputProps()} />
                    <Typography variant="body1">Kéo thả hoặc nhấp để chọn ảnh đại diện</Typography>
                </div>
                {avatarUrl && <AvatarPreview src={avatarUrl} alt="Avatar" />}
                
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        disabled={loading}
                        style={{ backgroundColor: "#BF6B7B", marginTop: '20px', width: '50%'}}
                    >
                        {loading ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ'}
                    </Button>
                </div>
            </div>
            
        </>
    )
}

const StyledInput = styled(TextField)({
    marginBottom: '20px',
    backgroundColor: '#F2CED5',
    // maxWidth: '400px'
});

const AvatarPreview = styled('img')({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'block',
    margin: '16px auto',
});


export default RegisterAdmin;