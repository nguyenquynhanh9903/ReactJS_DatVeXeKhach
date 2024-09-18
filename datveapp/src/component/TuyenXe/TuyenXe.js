import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { endpoints } from "../../config/API";
import { Alert, Button, Col, Container, Form, ListGroup, Row, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useQuery, useQueryClient } from "react-query";


const TuyenXe = () => {
    const [di, setDi] = useState('');
    const [den, setDen] = useState('');
    const [page, setPage] = useState(1);
    const [tuyenxe, setTuyenXe] = useState([]);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const fetchTuyenXe = useCallback(async () => {
        if (page === 0) {
            return { results: [], next: null }; // Không có dữ liệu
        }
    
        const url = di.trim() !== '' 
            ? `${endpoints['tuyenxe']}?diemdi=${di}&page=${page}` 
            : den.trim() !== '' 
            ? `${endpoints['tuyenxe']}?diemden=${den}&page=${page}` 
            : `${endpoints['tuyenxe']}?page=${page}`;
        
        // Gọi API để lấy dữ liệu
        console.log(page);
        const response = await API.get(url);
        const data = response.data;
    
        // Cập nhật trạng thái sau khi nhận dữ liệu
        if (page === 1) {
            setTuyenXe(data.results);
        } else if (page > 1) {
            setTuyenXe(
                current => [...current, ...data.results]
            );
        }
    
        // Cập nhật trang nếu không còn dữ liệu tiếp theo
        if (data.next === null) {
            setPage(0);
        }
    
        return data;
    }, [di, den, page]);


    const { data, isLoading, isFetching, isError } = useQuery(
        ['tuyenxe', di, den, page],
        fetchTuyenXe,
        {
            enabled: page > 0, // Chỉ thực hiện yêu cầu khi page > 0
            keepPreviousData: true,
            staleTime: 5000,
            onSuccess: (data) => {
                if (data.next === null) {
                    setPage(0); // Không còn dữ liệu tiếp theo
                }
            },
        }
    );


    const handleSearch = () => {
        setPage(1);
        queryClient.invalidateQueries('tuyenxe');
    };


    const handleLoadMore = () => {
        // Chỉ cho phép tải thêm khi page > 0 và không có lỗi hoặc đang tải
        if (!isLoading && !isFetching && page > 0) {
            setPage((prevPage) => prevPage + 1);
        }
    };


    const gotoChuyenXe = (TuyenXeID) => {
        navigate(`/chuyenxe/tuyen/${TuyenXeID}`);
    };

    
    const gotoSuaTuyenXe = (TuyenXeID) => {
        navigate(`/sua_tuyenxe/${TuyenXeID}`);
    };

    return (
        <Container>
            <Row className="mb-4 align-items-center">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Nhập điểm đi..."
                        value={di}
                        onChange={(e) => setDi(e.target.value)}
                    />
                </Col>
                <Col md={1} className="text-center">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <span className="text-muted">→</span>
                    </div>
                </Col>
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Nhập điểm đến..."
                        value={den}
                        onChange={(e) => setDen(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Button
                        variant="primary"
                        onClick={handleSearch}
                        className="w-100"
                    >
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : isError ? (
                <Alert variant="danger">Có lỗi xảy ra!</Alert>
            ) : (
                <>
                    <ListGroup>
                        {tuyenxe.map((c) => (
                            <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-center">
                                {c.Ten_tuyen}
                                <div>
                                    <Button
                                        variant="secondary"
                                        onClick={() => gotoChuyenXe(c.id)}
                                        className="me-2"
                                    >
                                        Tìm kiếm
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => gotoSuaTuyenXe(c.id)}
                                    >
                                        Sửa
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                        {isFetching && (
                            <div className="d-flex justify-content-center">
                                <Spinner animation="border" />
                            </div>
                        )}
                    </ListGroup>
                    {page > 0 && data && data.results.length > 0 && !isLoading && (
                        <Button onClick={handleLoadMore} variant="outline-primary" className="mt-3 w-100">
                            Tải thêm
                        </Button>
                    )}
                </>
            )}
        </Container>
    );

    
}

export default TuyenXe;