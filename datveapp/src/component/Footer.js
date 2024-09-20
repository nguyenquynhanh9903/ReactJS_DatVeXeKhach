import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
    return (
        <footer>
            <Container fluid style={styles.container}>
                <Row className="text-center mb-3">
                    <Col>
                        <h5 style={styles.title}>TRUNG TÂM TỔNG ĐÀI & CSKH</h5>
                        <p style={styles.phone}>1900 6067</p> {/* Số tổng đài trong hình */}
                        <p style={styles.company}>CÔNG TY CỔ PHẦN XE KHÁCH MAI ANH BUS</p>
                        <p style={styles.address}>Địa chỉ: 97 Võ Văn Tần, phường 6, quận 3, Thành phố Hồ Chí Minh</p>
                        <p style={styles.email}>Email: hotro@maianhbus.vn</p>
                        <p style={styles.phone}>Điện thoại: 02838386852</p>
                        <p style={styles.fax}>Fax: 02838386853</p>
                    </Col>
                    <Col>
                        <img
                            src="/logobus.png"
                            alt="Logo"
                            style={{ width: "300px", marginBottom: "30px" }}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col className="text-center" style={styles.copyright}>
                        <p style={{ margin: '0' }}>
                            © 2024 | Đề tài: Quản lý đặt vé xe khách
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

const styles = {
    container: {
        padding: '40px 20px',
        backgroundColor: '#fef5f3',
        color: '#333',
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#216e39',
    },
    phone: {
        fontSize: 25,
        color: '#d9001b',
        fontWeight: 'bold',
    },
    company: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#1d8247',
    },
    address: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
    },
    email: {
        fontSize: 14,
        color: '#555',
    },
    fax: {
        fontSize: 14,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
    },
    appButton: {
        width: '120px',
        height: '40px',
    },
    social: {
        marginTop: '20px',
    },
    socialIcon: {
        width: '40px',
        marginRight: '15px',
    },
    copyright: {
        backgroundColor: '#216e39',
        color: '#fff',
        padding: '10px',
        marginTop: '20px',
    },
}

export default Footer;
