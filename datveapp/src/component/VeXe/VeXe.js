import React, { useContext, useEffect, useState } from 'react';
import './Vexe.css';
import moment from 'moment';
import MyContext from '../../config/MyContext';
import API, { endpoints } from '../../config/API';

const VeXe = () => {
    const [state] = useContext(MyContext);
    const { user } = state;
    const [vexe, setVeXe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [ticketDetails, setTicketDetails] = useState(null); 
    const [chuyenXeDetails, setChuyenXeDetails] = useState([]); 
    const [seatDetails, setSeatDetails] = useState([]); // Thông tin ghế
    const [busDetails, setBusDetails] = useState([]); // Thông tin xe

    // Tải thông tin vé xe
    const loadVX = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url = `${endpoints['ve']}?mave=${q}&page=${page}`;
                const token = localStorage.getItem('access_token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                let res = await API.get(url, { headers });

                if (page === 1) {
                    setVeXe(res.data.results);
                } else if (page !== 0) {
                    setVeXe(current => [...current, ...res.data.results]);
                }
                if (res.data.next === null) {
                    setPage(0);
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
                setIsFetchingMore(false);
            }
        }
    }

    useEffect(() => {
        loadVX();
    }, [q, page]);

    // Kiểm tra xem cuộn đã gần đáy chưa
    const isCloseToBottom = (event) => {
        const { clientHeight, scrollTop, scrollHeight } = event.target;
        const paddingToBottom = 20;
        return clientHeight + scrollTop >= scrollHeight - paddingToBottom;
    };

    const loadMore = (event) => {
        if (!loading && !isFetchingMore && page > 0 && isCloseToBottom(event)) {
            setIsFetchingMore(true);
            setPage(page + 1);
        }
    }

    // Toggle chi tiết vé xe
    const toggleDetails = async (id, machuyenxe) => {
        if (expandedId === id) {
            setExpandedId(null);
            setTicketDetails(null);
            setChuyenXeDetails([]);
            setSeatDetails([]);
            setBusDetails([]);
            return;
        }

        setExpandedId(id);

        try {
            const token = localStorage.getItem('access_token');
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            // Lấy thông tin chi tiết vé xe
            const ticketResponse = await API.get(`${endpoints['chitietve']}?mave=${id}`, { headers });
            const ticketData = ticketResponse.data;

            // Lấy thông tin chuyến xe từ vé xe
            const chuyenXeResponse = await API.get(`${endpoints['chuyenxe']}?q=${machuyenxe}`, { headers });
            setChuyenXeDetails(chuyenXeResponse.data.results || []);

            if (Array.isArray(ticketData) && ticketData.length > 0) {
                const ticketItem = ticketData[0]; // Chọn phần tử đầu tiên hoặc xử lý theo nhu cầu

                // Lưu thông tin vé xe
                setTicketDetails(ticketItem);

                // Dựa vào mã ghế, lấy thông tin ghế
                const seatResponse = await API.get(`${endpoints['ghe']}?gheID=${ticketItem.Vi_tri_ghe_ngoi}`, { headers });
                setSeatDetails(seatResponse.data || []);

                // Dựa vào mã xe, lấy thông tin xe
                const busResponse = await API.get(`${endpoints['xe']}?q=${ticketItem.Ma_Xe}`, { headers });
                setBusDetails(busResponse.data || []);
            }
            
        } catch (error) {
            console.error('Error fetching ticket or chuyến xe details:', error);
        }
    }

    const search = (value) => {
        setPage(1);
        setQ(value);
    }

    // In vé
    const printTicket = () => {
        window.print();
    }

    return (
        <div className="container">
            <div>
                <h1 style={{marginLeft: 400}}>DANH SÁCH VÉ XE</h1>
            </div>
            <div style={{ marginTop: 10 }}>
                <input
                    type="text"
                    placeholder="Nhập id của vé xe..."
                    onChange={(e) => search(e.target.value)}
                    value={q}
                    className="searchbar"
                />
            </div>
            <div
                style={{ overflowY: 'scroll', height: '80vh' }}
                onScroll={loadMore}
            >
                {loading && <div className="loading">Loading...</div>}
                {vexe && vexe.map(c => (
                    <div
                        key={c.id}
                        className="list-item"
                        onClick={() => toggleDetails(c.id, c.Ma_ChuyenXe)}
                    >
                        <div className="list-item-content">
                            <div className="list-item-text">
                                <h1>Mã Vé: {c.id}</h1>
                                <p>Giá vé: {c.Gia}</p>
                                <p>Trạng thái thanh toán: {c.trangthai_TT}</p>
                                <p>Ngày đặt vé: {c.created_date ? moment(c.created_date).format('dddd, MMMM D, YYYY h:mm:ss A') : 'N/A'}</p>
                                {expandedId === c.id && ticketDetails && (
                                    <div className="ticket-details">
                                        {chuyenXeDetails.length > 0 && (
                                            <div className="chuyenxe-details">
                                                <h4>Chi tiết chuyến xe:</h4>
                                                {chuyenXeDetails.map((detail, index) => (
                                                    <div key={index} className="detail-item">
                                                        <p><strong>Tên Chuyến Xe:</strong> {detail.TenChuyenXe || 'N/A'}</p>
                                                        <p><strong>Ngày khởi hành:</strong> {moment(detail.Ngay).format('dddd, MMMM D, YYYY h:mm:ss A') || 'N/A'}</p>
                                                        <p><strong>Thời gian khởi hành:</strong> {detail.Giodi || 'N/A'}</p>
                                                        <p><strong>Điểm xuất phát:</strong> {detail.Noidi || 'N/A'}</p>
                                                        <p><strong>Điểm đến:</strong> {detail.Noiden || 'N/A'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {seatDetails.length > 0 && (
                                            <div className="seat-details">
                                                {seatDetails.map((seat, index) => (
                                                    <div key={index} className="seat-item">
                                                        <h4>Chi tiết ghế:</h4>
                                                        <p><strong>Số Ghế:</strong> {seat.So_ghe || 'N/A'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {busDetails.length > 0 && (
                                            <div className="bus-details">
                                                <h4>Chi tiết xe:</h4>
                                                {busDetails.map((bus, index) => (
                                                    <div key={index} className="bus-item">
                                                        <p><strong>Tên Xe:</strong> {bus.Ten_xe || 'N/A'}</p>
                                                        <p><strong>Biển Số:</strong> {bus.Bien_so || 'N/A'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <button className="print-button" onClick={printTicket}>
                                            In Vé
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="button-container">
                    <button className="button" style={{ width: 150 }} onClick={() => window.history.back()}>
                        Quay lại
                    </button>
                </div>
                {loading && page > 1 && <div className="loading">Loading...</div>}
            </div>
        </div>
    );
}

export default VeXe;