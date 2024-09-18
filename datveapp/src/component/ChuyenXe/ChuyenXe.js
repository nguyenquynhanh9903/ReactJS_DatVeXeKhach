import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './css/ChuyenXe.css'; 
import API, { endpoints } from '../../config/API';

const ChuyenXe = () => {
    const { TuyenXeID } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [chuyenxe, setChuyenXe] = useState([]);
    const [tuyenxe, setTuyenXe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectTime] = useState('');
    const [selectedNoi, setSelectNoi] = useState('');
    const [locchuyenxe, setLocChuyenXe] = useState([]);
    const [searchResultFound, setSearchResultFound] = useState(true);
    const [ngayle, setNgayLe] = useState([]);
    const [taixe, setTaiXe] = useState([]);
    const [xe, setXe] = useState([]);
    const [tuyenXeGia, setTuyenXeGia] = useState(0);

    const loadCX = async () => {
        setLoading(true);
        try {
            const url = `${endpoints['tuyenxe']}${TuyenXeID}/ChuyenXe/`;
            const res = await API.get(url);
            setChuyenXe(res.data);
            setLocChuyenXe(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadTX = async () => {
        try {
            setLoading(true);
            const url = `${endpoints['tuyenxe']}?q=${TuyenXeID}`;
            const res = await API.get(url);
            setTuyenXe(res.data.results);
            if (res.data.results.length > 0) {
                setTuyenXeGia(res.data.results[0].BangGia); // Lưu giá tuyến xe
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };
    
    const loadNgayLe = async () => {
        try {
            const res = await API.get(endpoints['le']);
            setNgayLe(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadTaiXe = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                const url = `${endpoints['taixe']}?page=${page}`;
                const res = await API.get(url);
                if (page === 1) {
                    setTaiXe(res.data.results);
                    setPage(page + 1);
                } else {
                    setTaiXe(current => [...current, ...res.data.results]);
                    setPage(page + 1);
                }
                if (res.data.next === null) {
                    setPage(0);
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    const loadXe = async () => {
        try {
            setLoading(true);
            const res = await API.get(endpoints['xe']);
            setXe(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCX();
        loadTX();
        loadNgayLe();
        loadTaiXe();
        loadXe();
    }, [TuyenXeID]);

    const findTaiXeName = (taiXeId) => {
        const taiXe = taixe.find(t => t.id === taiXeId);
        return taiXe ? taiXe.Ten_taixe : 'Chưa có';
    };
    
    const findXeName = (xeId) => {
        const xe1 = xe.find(x => x.id === xeId);
        return xe1 ? xe1.Bien_so : 'Chưa có';
    };
    
    const findLoaiXe = (xeId) => {
        const xe1 = xe.find(x => x.id === xeId);
        return xe1 ? loaiXe(xe1.Loaixe) : 'Chưa có';
    };

    const searchByDate = (date) => {
        if (!date) {
            setLocChuyenXe(chuyenxe);
            return;
        }
        const searchDate = moment(date).format('YYYY/MM/DD');
        const filteredChuyenXe = chuyenxe.filter(c => moment(c.Ngay).format('YYYY/MM/DD') === searchDate);
        setLocChuyenXe(filteredChuyenXe);
        setSearchResultFound(filteredChuyenXe.length > 0);
    };

    const searchByTime = (time) => {
        if (!time) {
            setLocChuyenXe(chuyenxe);
            return;
        }
        const filter = chuyenxe.filter(c => c.Giodi === time);
        setLocChuyenXe(filter);
        setSearchResultFound(filter.length > 0);
    };

    const searchByNoi = (noi) => {
        if (!noi) {
            setLocChuyenXe(chuyenxe);
            return;
        }
        const filter = chuyenxe.filter(c => c.Noidi === noi);
        setLocChuyenXe(filter);
        setSearchResultFound(filter.length > 0);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        searchByDate(date);
    };

    useEffect(() => {
        if (!searchResultFound) {
            alert('Hãy xem kết quả tìm kiếm');
        }
    }, [searchResultFound]);

    const formDate = (date) => {
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    };

    const tinhGia = (ngay) => {
        const ngayFormatted = formDate(ngay);
        const ngayLe = ngayle.find(c => c.Le === ngayFormatted);
        let gia = tuyenXeGia; 
        if (ngayLe) {
            const phantram = 1 + parseFloat(ngayLe.Tang.replace("%", "")) / 100;
            gia *= phantram;
        }
        const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia);
        return formatPrice;
    };

    const tinhGia1 = (ngay) => {
        const ngayFormatted = formDate(ngay);
        const ngayLe = ngayle.find(c => c.Le === ngayFormatted);
        let gia = tuyenXeGia; 
        if (ngayLe) {
            const phantram = 1 + parseFloat(ngayLe.Tang.replace("%", "")) / 100;
            gia *= phantram;
        }
        return gia;
    };
    
    const loaiXe = (maloai) => {
        return maloai === 1 ? "Ghế" : "Giường";
    };

    const uniqueArray = (arr) => {
        return arr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    };

    const noiArray = uniqueArray(chuyenxe.map(c => c.Noidi));
    const gioArray = uniqueArray(chuyenxe.map(c => c.Giodi));

    const gotoChuyenXeDetail = (ChuyenXeID, Gia) => {
        navigate(`/chuyenxe/detail/${ChuyenXeID}?Gia=${Gia}`);
    };    

    const goToTuyenXe = () => {
        navigate('/tuyenxe')
    };

    const gotoThemChuyen = (TuyenXeID) => {
        // window.location.href = `/Them-Chuyen-Xe/${TuyenXeID}`;
    };

    return (
        <div className="chuyenxe-container">
            <header className="chuyenxe-header">
                {tuyenxe && tuyenxe.map(d => (
                    <div key={d.id} className="header-content">
                        <h1 className="title">Tuyến Xe {d.Ten_tuyen}</h1>
                    </div>
                ))}
            </header>
            <div className="filters">
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    className="date-picker"
                    placeholderText="Chọn ngày"
                />
                <select
                    value={selectedNoi}
                    onChange={(e) => {
                        setSelectNoi(e.target.value);
                        searchByNoi(e.target.value);
                    }}
                    className="picker"
                >
                    <option value="">Nơi khởi hành</option>
                    {noiArray.map((value, index) => (
                        <option key={index} value={value}>{value}</option>
                    ))}
                </select>
                <select
                    value={selectedTime}
                    onChange={(e) => {
                        setSelectTime(e.target.value);
                        searchByTime(e.target.value);
                    }}
                    className="picker"
                >
                    <option value="">Thời gian đi</option>
                    {gioArray.map((value, index) => (
                        <option key={index} value={value}>{value}</option>
                    ))}
                </select>
            </div>
            <div className="chuyenxe-list">
                {loading && <div className="loading">Đang tải dữ liệu...</div>}
                {locchuyenxe.length > 0 ? (
                    locchuyenxe.map(cx => (
                        <div key={cx.id} className="chuyenxe-item">
                            <div className="chuyenxe-info-row">
                                <p className="chuyenxe-info">Giờ đi: {cx.Giodi} - Giờ đến: {cx.Gioden}</p>
                            </div>
                            <div className="chuyenxe-info-row">
                                <p className="chuyenxe-info">Nơi đi: {cx.Noidi} - Nơi đến: {cx.Noiden}</p>
                            </div>
                            <div className="chuyenxe-info-row">
                                <p className="chuyenxe-info">Tên tài xế: {findTaiXeName(cx.Ma_TaiXe)}</p>
                                <p className="chuyenxe-info">Mã số xe: {findXeName(cx.Ma_Xe)}</p>
                                <p className="chuyenxe-info">Loại xe: {findLoaiXe(cx.Ma_Xe)}</p>
                            </div>
                            <p className="chuyenxe-price">Giá: {tinhGia(cx.Ngay)}</p>
                            <button className="btn-detail" onClick={() => gotoChuyenXeDetail(cx.id, tinhGia1(cx.Ngay))}>Chi tiết</button>
                        </div>

                    ))
                ) : (
                    <p className="no-results">Không có chuyến xe phù hợp</p>
                )}
            </div>
            <div className="actions">
                <button onClick={() => gotoThemChuyen(TuyenXeID)} className="btn-add">Thêm Chuyến Xe</button>
                <button onClick={goToTuyenXe} className="btn-back">Quay lại</button>
            </div>
        </div>
    );
};

export default ChuyenXe;