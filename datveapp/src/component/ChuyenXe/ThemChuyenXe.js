import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import API, { BASE_URL, endpoints } from '../../config/API';


export default function ThemCX() {
    const { TuyenXeID } = useParams();
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [ngay, setNgay] = useState('');
    const [giodi, setGioDi] = useState('');
    const [gioden, setGioDen] = useState('');
    const [chotrong, setChoTrong] = useState('');
    const [noidi, setNoiDi] = useState('');
    const [noiden, setNoiDen] = useState('');
    const [mataixe, setMaTaiXe] = useState('');
    const [maxe, setMaXe] = useState('');
    const [taixe, setTaiXe] = useState([]);
    const [xe, setXe] = useState([]);

    const loadTaiXe = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                const url = `${endpoints['taixe']}?page=${page}`;
                const res = await API.get(url);
                if (page === 1) {
                    setTaiXe(res.data.results);
                    setPage(page + 1);
                } else if (page !== 0) {
                    setTaiXe((current) => [...current, ...res.data.results]);
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
        loadTaiXe();
        loadXe();
    }, []);

    const themChuyen = async () => {
        try {
            if (!name || !ngay || !giodi || !gioden || !chotrong || !noidi || !noiden || !mataixe || !maxe) {
                alert('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            const formattedNgay = moment(ngay, 'DD/MM/YYYY').format('YYYY-MM-DD');
            const token = localStorage.getItem('access_token');
            const response = await fetch(BASE_URL + endpoints['them_chuyenXe'], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    TenChuyenXe: name,
                    Ngay: formattedNgay,
                    Ma_Tuyen: parseInt(TuyenXeID),
                    Giodi: giodi,
                    Gioden: gioden,
                    Cho_trong: chotrong,
                    Noidi: noidi,
                    Noiden: noiden,
                    Ma_TaiXe: parseInt(mataixe),
                    Ma_Xe: parseInt(maxe),
                }),
            });

            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi khi thêm chuyến xe');
            }
            alert('Thêm thành công');
            navigate(`/chuyenxe/tuyen/${TuyenXeID}`); 
            resetForm();
        } catch (error) {
            console.error('Lỗi:', error.message);
            alert('Đã xảy ra lỗi khi thêm chuyến xe');
        }
    };

    const resetForm = () => {
        setName('');
        setNgay('');
        setGioDi('');
        setGioDen('');
        setChoTrong('');
        setNoiDi('');
        setNoiDen('');
        setMaTaiXe('');
        setMaXe('');
    };

    return (
        <div className="container">
            <div className="form-group">
                <label>Tên chuyến xe</label>
                <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <p> Vui lòng nhập ngày theo định dạng DD/MM/YYYY !</p>
            <div className="form-group">
                <label>Ngày</label>
                <input
                    type="text"
                    className="input"
                    value={ngay}
                    onChange={(e) => setNgay(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Giờ Đi</label>
                <input
                    type="text"
                    className="input"
                    value={giodi}
                    onChange={(e) => setGioDi(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Giờ Đến</label>
                <input
                    type="text"
                    className="input"
                    value={gioden}
                    onChange={(e) => setGioDen(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Số Chỗ</label>
                <input
                    type="text"
                    className="input"
                    value={chotrong}
                    onChange={(e) => setChoTrong(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Nơi Đi</label>
                <input
                    type="text"
                    className="input"
                    value={noidi}
                    onChange={(e) => setNoiDi(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Nơi Đến</label>
                <input
                    type="text"
                    className="input"
                    value={noiden}
                    onChange={(e) => setNoiDen(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Tài Xế</label>
                <select
                    className="input"
                    value={mataixe}
                    onChange={(e) => setMaTaiXe(e.target.value)}
                >
                    <option value="">Chọn tài xế</option>
                    {taixe.map((tx) => (
                        <option key={tx.id} value={tx.id}>
                            {tx.Ten_taixe}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Xe</label>
                <select
                    className="input"
                    value={maxe}
                    onChange={(e) => setMaXe(e.target.value)}
                >
                    <option value="">Chọn xe</option>
                    {xe.map((x) => (
                        <option key={x.id} value={x.id}>
                            {x.Bien_so}
                        </option>
                    ))}
                </select>
            </div>
            <div className="button-container">
                <button className="button" onClick={() => navigate(`/chuyenxe/tuyen/${TuyenXeID}`)}>
                    Quay Lại
                </button>
                <button className="button" onClick={themChuyen}>
                    Thêm chuyến xe
                </button>
            </div>
        </div>
    );
}