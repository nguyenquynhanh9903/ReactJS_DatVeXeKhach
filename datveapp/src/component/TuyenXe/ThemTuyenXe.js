import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import API, { endpoints } from '../../config/API';

const ThemTuyenXe = () => {
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

    const updateState = (field, value) => {
        setTuyenXe(current => ({ ...current, [field]: value }));
    };

    const addTuyenXe = async () => {
        try {
            const form = new FormData();
            for (const key in tuyenXe) {
                form.append(key, tuyenXe[key]);
            }

            const token = localStorage.getItem('access_token'); // Thay AsyncStorage bằng localStorage
            const response = await API.post(endpoints['them_tuyenXe'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status !== 201) {
                throw new Error('Đã xảy ra lỗi khi thêm tuyến xe.');
            } else {
                setSuccess('Thêm tuyến xe thành công. Vui lòng quay lại trang Danh Sách Tuyến Xe xem kết quả');
                setError('');
                setTimeout(() => {
                    navigate('/tuyenxe');
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            setError('Đã xảy ra lỗi khi thêm tuyến xe.');
            setSuccess('');
        }
    };

    return (
        <>
            <Container>
                <Row className="my-4">
                    <Col md={6} className="mx-auto">
                        {fields.map(field => (
                            <Form.Group className="mb-3" controlId={`formBasic${field.name}`} key={field.name}>
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
                            <Button variant="primary" onClick={addTuyenXe}>
                                Thêm tuyến xe
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
        
    );
};

export default ThemTuyenXe;