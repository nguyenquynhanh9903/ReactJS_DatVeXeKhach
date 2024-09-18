import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import API, { endpoints } from '../../config/API';


const SuaTuyenXe = () => {
    const { TuyenXeID } = useParams(); // Thay route.params bằng useParams từ react-router-dom
    const navigate = useNavigate();
    const [tuyenXe, setTuyenXe] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fields = [
        { label: 'Tên tuyến xe', name: 'Ten_tuyen' },
        { label: 'Điểm đi', name: 'Diendi' },
        { label: 'Điểm đến', name: 'Diemden' },
        { label: 'Bảng giá', name: 'BangGia' },
    ];

    useEffect(() => {
        fetchTuyenXeData();
    }, [TuyenXeID]);

    const updateState = (field, value) => {
        setTuyenXe(current => ({ ...current, [field]: value }));
    };

    const fetchTuyenXeData = async () => {
        try {
            const res = await API.get(`${endpoints['tuyenxe']}?q=${TuyenXeID}`);
            const data = res.data.results;
            if (data && data.length > 0) {
                setTuyenXe(data[0]);
            }
        } catch (err) {
            console.error('Lỗi khi lấy thông tin tuyến xe.', err);
        }
    };

    const suaTuyenXe = async () => {
        try {
            const token = localStorage.getItem('access_token'); // Thay AsyncStorage bằng localStorage
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            await API.put(`${endpoints['tuyenxe']}${TuyenXeID}/Sua_TuyenXe/`, {
                Ten_tuyen: tuyenXe.Ten_tuyen,
                Diendi: tuyenXe.Diendi,
                Diemden: tuyenXe.Diemden,
                BangGia: tuyenXe.BangGia,
            }, { headers });
            await fetchTuyenXeData();
            console.log('Thông tin tuyến xe đã được cập nhật');
            setSuccess('Cập nhật thành công. Bạn vui lòng quay lại trang Tuyến xe để xem sự thay đổi.');
            setError('');
            setTimeout(() => {
                navigate('/tuyenxe');
            }, 2000);
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin tuyến xe.', err);
            setError('Đã xảy ra lỗi khi cập nhật thông tin tuyến xe.');
            setSuccess('');
        }
    };

    const xoaTuyenXe = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tuyến xe này?')) {
            try {
                const res = await API.delete(`${endpoints['tuyenxe']}${TuyenXeID}/Xoa_TuyenXe`);
                if (res.status === 204) {
                    console.log('Tuyến xe được xóa thành công');
                    setSuccess('Xóa thành công. Bạn vui lòng quay lại trang Tuyến Xe để xem sự thay đổi.');
                    setError('');
                    setTimeout(() => {
                        navigate('/tuyenxe');
                    }, 2000);
                } else {
                    console.error('Không thể xóa tuyến xe');
                }
            } catch (err) {
                console.error('Lỗi khi xóa tuyến xe.', err);
                setError('Đã xảy ra lỗi khi xóa tuyến xe.');
                setSuccess('');
            }
        }
    };

    return (
        <Container>
            <Row className="my-4">
                <Col md={6} className="mx-auto">
                    {fields.map(field => (
                        <Form.Group className="mb-3" key={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={`Nhập ${field.label.toLowerCase()}`}
                                value={tuyenXe[field.name] || ''}
                                onChange={e => updateState(field.name, e.target.value)}
                            />
                        </Form.Group>
                    ))}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="secondary" onClick={() => navigate('/tuyenxe')}>
                            Quay lại
                        </Button>
                        <Button variant="primary" onClick={suaTuyenXe}>
                            Lưu
                        </Button>
                        <Button variant="danger" onClick={xoaTuyenXe}>
                            Xóa
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default SuaTuyenXe;