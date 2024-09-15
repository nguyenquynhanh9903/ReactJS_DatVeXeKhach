
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import MyContext from '../../configs/MyContext';
import API, { endpoints } from '../../configs/API';
import CustomerForm from './InfoKhach';
import './css/DatVe.css';

const DatVe = () => {
    const navigate = useNavigate();
    const { ChuyenXeID } = useParams();
    const [state] = useContext(MyContext);
    const { user } = state;
    const [chuyenxe, setChuyenXe] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [ghe, setGhe] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [tuyen, setTuyen] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [le, setLe] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const colors = {
        chon: '#0000CD',
        chonDuoc: '#006400',
        trong: '#d3d3d3'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [chuyenXeRes, leRes] = await Promise.all([
                    API.get(`${endpoints['chuyenxe']}?q=${ChuyenXeID}`),
                    API.get(endpoints['le'])
                ]);

                setChuyenXe(chuyenXeRes.data.results);
                setLe(leRes.data);

                if (chuyenXeRes.data.results.length > 0) {
                    const chuyenXe = chuyenXeRes.data.results[0];
                    const [gheRes, tuyenRes] = await Promise.all([
                        API.get(`${endpoints['ghe']}?q=${chuyenXe.Ma_Xe}`),
                        API.get(`${endpoints['tuyenxe']}?q=${chuyenXe.Ma_Tuyen}`)
                    ]);

                    setGhe(gheRes.data);
                    setTuyen(tuyenRes.data.results);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [ChuyenXeID]);

    const handleCustomerSubmit = customer => {
        setCustomers(prevCustomers => [...prevCustomers, customer]);
    };

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
    };

    const handleSeatSelect = seat => {
        setSelectedSeats(prevSeats =>
            prevSeats.includes(seat)
                ? prevSeats.filter(s => s !== seat)
                : [...prevSeats, seat]
        );
    };

    const gia = tuyen.map(c => c.BangGia)[0] || 0; // Lấy giá từ tuyến xe đầu tiên
    const formDate = (date) => moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');

    const tinhTien = () => {
        const soGheDaChon = selectedSeats.length;
        let tongTien = soGheDaChon * gia;

        chuyenxe.forEach(chuyen => {
            const ngayChuyen = formDate(chuyen.Ngay);
            const tangGia = le.find(item => item.Le === ngayChuyen);
            if (tangGia) {
                const phanTramTang = parseFloat(tangGia.Tang.replace("%", ""));
                tongTien *= 1 + phanTramTang / 100;
            }
        });

        return tongTien;
    };

    const giaLe = () => {
        return tuyen.map(c => {
            const ngayFormatted = formDate(c.Ngay);
            const ngayLeItem = le.find(item => item.Le === ngayFormatted);
            if (ngayLeItem) {
                const phantram = 1 + parseFloat(ngayLeItem.Tang.replace("%", "")) / 100;
                return gia * phantram;
            } else {
                return gia;
            }
        });
    };

    const dinhDangGia = (gia) => gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const handlePaymentMoMo = async () => {
        console.log(tinhTien().toString());
        try {
            const response = await API.post(endpoints['momo'], null, {
                headers: { amount: tinhTien().toString() }
            });
            console.log(response.data);
            if (response.data.payUrl) {
                window.open(response.data.payUrl, '_blank');
            } else {
                alert('Có lỗi xảy ra khi tạo đơn hàng MoMo. Vui lòng thử lại sau!');
            }
        } catch (error) {
            console.error('Error handling MoMo payment:', error);
            alert('Có lỗi xảy ra khi tạo đơn hàng MoMo. Vui lòng thử lại sau!');
        }
    };

    const handlePaymentZalo = async () => {
        try {
            const response = await API.post(endpoints['zalo'], null, {
                headers: { amount: tinhTien().toString() }
            });
            if (response.data.order_url) {
                window.open(response.data.order_url, '_blank');
            } else {
                alert('Có lỗi xảy ra khi tạo đơn hàng Zalo. Vui lòng thử lại sau!');
            }
        } catch (error) {
            console.error('Error handling Zalo payment:', error);
            alert('Có lỗi xảy ra khi tạo đơn hàng Zalo. Vui lòng thử lại sau!');
        }
    };

    const handleSubmit = async () => {
        if (customers.length === 0 || selectedSeats.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin!!!");
            return;
        }
    
        if (!user || !(user.Loai_NguoiDung === 3 || user.Loai_NguoiDung === 1 || user.Loai_NguoiDung === 4)) {
            alert("Vui lòng đăng nhập trước khi đặt vé!!!");
            return;
        }
    
        setIsProcessing(true); 
    
        try {
            const customerIds = [];
            for (const customer of customers) {
                const customerData = {
                    Ten_KH: customer.name,
                    DiaChi: customer.diachi,
                    CMND: customer.CMND,
                    DienThoai: customer.dienthoai,
                    Email: customer.email,
                };
                const customerRes = await API.post(endpoints['them_KH_Di'], customerData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                customerIds.push(customerRes.data.id);
            }
    
            let trangthai_TT = '';
            if (paymentMethod) {
                switch (paymentMethod) {
                    case 'momo':
                        trangthai_TT = 'Đã thanh toán qua Momo';
                        await handlePaymentMoMo();
                        break;
                    case 'zalo':
                        trangthai_TT = 'Đã thanh toán qua Zalo';
                        await handlePaymentZalo();
                        break;
                    case 'cash':
                        trangthai_TT = 'Trực tiếp';
                        break;
                    default:
                        alert("Phương thức thanh toán không hợp lệ!");
                        return;
                }
                // Navigate after handling payment, to prevent redirect before payment
                navigate('/tuyenxe');
            }
    
            const veID = [];
            for (let i = 0; i < customers.length; i++) {
                const customerId = customerIds[i];
                const ticketData = {
                    Ma_NhanVien: null, // Add appropriate ID if needed
                    Ma_KhachHang: parseInt(customerId),
                    Ma_ChuyenXe: parseInt(chuyenxe[0].id), // Assuming you need the first element
                    Gia: giaLe()[0].toString(), // Assuming you need the first element
                    trangthai_TT: trangthai_TT.toString(),
                };
                const ticketRes = await API.post(endpoints['them_Ve'], ticketData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const ticketId = ticketRes.data.id;
                veID.push(ticketId);
            }
    
            console.log(veID);
    
            // 2.1. Thêm dữ liệu chi tiết vé cho từng ghế đã chọn của khách hàng
            for (const c of veID) {
                const ticketDetailData = [];
                await Promise.all(selectedSeats.map(async seat => {
                    try {
                        const resGheDaChon = await API.get(`${endpoints['ghe']}?maghe=${seat}`);
                        const gheDaChon = resGheDaChon.data;
    
                        if (gheDaChon.length > 0) {
                            const detailData = gheDaChon.map(seat => ({
                                Ma_Ve: c,
                                Ma_Xe: parseInt(seat.Bienso_Xe),
                                Vi_tri_ghe_ngoi: parseInt(seat.id),
                                Ghichu: "Không có",
                            }));
                            ticketDetailData.push(...detailData);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }));
    
                let accessToken = localStorage.getItem("access_token");
                for (const detailData of ticketDetailData) {
                    try {
                        await API.post(endpoints['them_chi_tiet_ve'](c), detailData, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
    
            // 3. Cập nhật lại trạng thái của các ghế đã chọn
            const selectedSeatsData = await Promise.all(selectedSeats.map(async seat => {
                try {
                    const resGheDaChon = await API.get(`${endpoints['ghe']}?maghe=${seat}`);
                    const gheDaChon = resGheDaChon.data;
                    console.log(gheDaChon);
                    if (gheDaChon.length > 0) {
                        const gheId = gheDaChon[0].id; // Lấy id của ghế từ dữ liệu API
                        return {
                            id: gheId, // ID của ghế
                            trangthai: 'booked', // Trạng thái mới của ghế
                        };
                    }
                } catch (error) {
                    console.error(error);
                }
            }));
    
            // Thực hiện cập nhật trạng thái của các ghế đã chọn
            await Promise.all(selectedSeatsData.map(async seatData => {
                if (seatData) {
                    try {
                        console.log(seatData);
                        await API.patch(`/Ghe/${seatData.id}/CapNhat_TT/`, seatData);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }));
    
            alert('Đặt vé thành công!');
            navigate('/tuyenxe');
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại sau!');
        } finally {
            setIsProcessing(false); // Stop processing
        }
    };

    return (
        <div className="dat-ve-container">
            <h1 className="page-title">Đặt Vé</h1>
            <div className="chuyen-xe-info">
                <h2>Thông Tin Chuyến Xe</h2>
                {chuyenxe.map(c => (
                    <div key={c.id} className="chuyen-xe-details">
                        <p><strong>Tên Chuyến Xe:</strong> {c.TenChuyenXe}</p>
                        <p><strong>Thời Gian Khởi Hành:</strong> {moment(c.Ngay).format('DD/MM/YYYY')}</p>
                        <p><strong>Điểm Xuất Phát:</strong> {c.Noidi}</p>
                        <p><strong>Điểm Đến:</strong> {c.Noiden}</p>
                    </div>
                ))}
            </div>
            <div className="seat-selection">
                <h2>Chọn ghế Xe</h2>
                {ghe.map(g => (
                    <button
                        key={g.Ma_Ghe}
                        className={`seat-button ${selectedSeats.includes(g.So_ghe) ? 'selected' : 'available'}`}
                        onClick={() => handleSeatSelect(g.So_ghe)}
                    >
                        {g.So_ghe}
                    </button>
                ))}
            </div>
            <CustomerForm onSubmit={handleCustomerSubmit} />
            <div className="customer-list">
                <h2>Danh Sách Khách Hàng</h2>
                {customers.length > 0 ? (
                    <ul>
                        {customers.map((customer, index) => (
                            <li key={index}>
                                {customer.name} - {customer.diachi} - {customer.CMND} - {customer.dienthoai} - {customer.email}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Chưa có khách hàng nào.</p>
                )}
            </div>
            <div className="payment-methods">
                <label>
                    <input
                        type="radio"
                        value="momo"
                        checked={paymentMethod === 'momo'}
                        onChange={() => handlePaymentMethodSelect('momo')}
                    />
                    Thanh toán MoMo
                </label>
                <label>
                    <input
                        type="radio"
                        value="zalo"
                        checked={paymentMethod === 'zalo'}
                        onChange={() => handlePaymentMethodSelect('zalo')}
                    />
                    Thanh toán Zalo
                </label>
                <label>
                    <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => handlePaymentMethodSelect('cash')}
                    />
                    Thanh toán tiền mặt
                </label>
            </div>
            <div className="total-price">
                <h3>Tổng tiền: {dinhDangGia(tinhTien())}</h3>
                <button
                    className="confirm-button"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                >
                    Xác Nhận Đặt Vé
                </button>
            </div>
        </div>
    );
};

export default DatVe;
