import { useContext, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import MyContext from "../../config/MyContext";
import API, { endpoints } from "../../config/API";



const Profile = () => {
    const [ user ] = useContext(MyContext);
    const [ve, setVe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allTickets, setAllTickets] = useState([]);
    const [allGhe, setAllGhe] = useState([]);
    const [tenChuyenXe, setTenChuyenXe] = useState([]);
    const [chucVu, setChucVu] = useState(null);
    const [gioDi, setGioDi] = useState([]);
    const [chitiet, setChiTiet] = useState([]);
    const [ticketDetailsVisible, setTicketDetailsVisible] = useState(false);
    const today = new Date()
    console.log(user.user);
    today.setHours(0, 0, 0, 0);

    const loadVe = async () => {
        try {
            setLoading(true);
            const res = await API.get(`${endpoints['chitietve']}?mauser=${user.user.id}`);
            setChiTiet(res.data);

            const veData = await Promise.all(res.data.map(async (c) => {
                const resVe = await API.get(`${endpoints['ve']}?mave=${c.vexe}`);
                return resVe.data.results;
            }));
            setVe(veData);

            const tickets = []
            veData.forEach(array => {
                array.forEach(ticket => {
                    tickets.push(ticket)
                })
            })
            setAllTickets(tickets)

        } catch (error) {
            console.error('Lỗi khi tải vé:', error);
        } finally {
            setLoading(false);
        }
    }

    const uniqueTickets = Array.from(new Set(allTickets.map(ticket => ticket.id)))
        .map(id => {
            return allTickets.find(ticket => ticket.id === id)
        })

    const loadChuyen = async (allTickets) => {
        try {
            const tenChuyenXeArray = [];
            const gioArray = [];

            for (const ticket of allTickets) {
                const resChuyen = await API.get(`${endpoints['chuyenxe']}?q=${ticket.Ma_ChuyenXe}`);
                if (Array.isArray(resChuyen.data.results)) {
                    const filteredResults = resChuyen.data.results.filter(result => !("_h" in result && "_i" in result && "_j" in result && "_k" in result));
                    const tenChuyenXe = filteredResults.map(c => c.TenChuyenXe);
                    const giodi = filteredResults.map(c => c.Giodi);
                    tenChuyenXeArray.push(...tenChuyenXe);
                    gioArray.push(...giodi);
                }
            }

            setTenChuyenXe(tenChuyenXeArray);
            setGioDi(gioArray);
        } catch (error) {
            console.error(error);
        }
    } 

    const loadGhe = async (chitiet, allTickets) => {
        try{
            const tenGheArray = [];
            for (const c of chitiet){
            for (const d of allTickets){
                    if(c.vexe === d.id){
                        const resGhe = await API.get(`${endpoints['ghe']}?gheID=${c.Vi_tri_ghe_ngoi}`);
                        if (Array.isArray(resGhe.data)) {
                            const filteredResults = resGhe.data.filter(result => !("_h" in result && "_i" in result && "_j" in result && "_k" in result));
                            const tenGhe = filteredResults.map(c => c.So_ghe);
                            tenGheArray.push(...tenGhe);
                        }
                    }
                }
            }
            setAllGhe(tenGheArray);

        } catch (error) {
            console.error('Lỗi khi tải ghế: ', error);
        }
    }

    const uniqueGhe = allGhe.filter((value, index, self) => {
        return self.indexOf(value) === index
    })

    const ChucVu = async() => {
        try{
            const resChucvu = await API.get(`${endpoints['chucvu']}?ma=${user.user.Loai_NguoiDung}`);
            setChucVu(resChucvu.data);
        } catch (error){
            console.error('Lỗi: ', error);
        }
    }

    useEffect(() => {
        loadVe()
        ChucVu()
    }, [user])

    useEffect(() => {
        const fetchData = async () => {
            await loadChuyen(allTickets);
            await loadGhe(chitiet, allTickets)
        };
        fetchData();
    }, [chitiet, allTickets]);

    function chuyenDoiNgay(chuoiThoiGian) {
        const date = new Date(chuoiThoiGian);
        const ngay = date.getDate();
        const thang = date.getMonth() + 1; 
        const nam = date.getFullYear();
        const ngayFormatted = ngay < 10 ? '0' + ngay : ngay;
        const thangFormatted = thang < 10 ? '0' + thang : thang;
        return ngayFormatted + '/' + thangFormatted + '/' + nam;
    }
    
    const toggleTicketDetailsVisibility = () => {
        setTicketDetailsVisible(!ticketDetailsVisible)
    }

   const renderTicketDetails = () => {
    return (
        <Container fluid style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Row>
                {uniqueTickets.map((ticket, index) => (
                    <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Text>Mã vé: {ticket.id}</Card.Text>
                                <Card.Text>Ngày đặt: {chuyenDoiNgay(ticket.updated_date)}</Card.Text>
                                <Card.Text>Thanh toán: {ticket.trangthai_TT}</Card.Text>
                                <Card.Text>Chuyến xe: {tenChuyenXe[index]}</Card.Text>
                                <Card.Text>Ghế ngồi: {uniqueGhe[index]}</Card.Text>
                                <Card.Text>Giờ đi: {gioDi[index]}</Card.Text>
                                <Card.Text style={{ color: 'blue', textAlign: 'right' }}>
                                    {new Date(ticket.updated_date) >= today ? 'Chưa hoàn thành' : 'Đã hoàn thành'}
                                </Card.Text>
                                <Button variant="primary">Xem chi tiết</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        
    )
   }

    return (
        <>
            <Container fluid style={{ overflowY: 'auto' }}>
                <Row className="mb-3" style={{marginTop: '20px'}}>
                    <Col>
                        <h2 className="text-center" style={{ fontSize: '2.5rem' }}>THÔNG TIN TÀI KHOẢN</h2>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col xs={12} md={3} className="text-center">
                        <Image
                            src={user.user.avatar}
                            alt="Avatar"
                            roundedCircle
                            fluid
                            style={{ width: '200px', height: '200px' }}
                        />
                    </Col>

                    <Col xs={12} md={5}>
                        <div className="p-3 border" style={{borderRadius: '5px'}}>
                            {user.Loai_NguoiDung === "4" && (
                                <p><strong>Tên:</strong> {[user.user.first_name, user.user.last_name].join(' ')}</p>
                            )}
                            <p><strong>Tên:</strong> {[user.user.last_name, user.user.first_name].join(' ')}</p>
                            <p><strong>Email:</strong> {user.user.email}</p>
                            {chucVu && chucVu.map(c => (
                                <p key={c.id}><strong>Bạn là:</strong> {c.loai.toUpperCase()}</p>
                            ))}
                        </div>
                    </Col>
                </Row>

                <Row className="text-center mt-4">
                    <Col>
                        <Button variant="link" onClick={toggleTicketDetailsVisibility}>
                            Xem chi tiết đơn hàng
                        </Button>
                    </Col>
                </Row>

                {ticketDetailsVisible && (
                    <Row className="mt-3">
                        <Col>
                            {renderTicketDetails()}
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    )
}

export default Profile;