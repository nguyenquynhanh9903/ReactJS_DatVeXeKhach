import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/SuaCX.css'; 
import API, { endpoints } from '../../config/API';

const SuaChuyenXe = () => {
    const navigate = useNavigate();
    const { ChuyenXeID } = useParams();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [ngay, setNgay] = useState('');
    const [gioDi, setGioDi] = useState('');
    const [gioDen, setGioDen] = useState('');
    const [chotrong, setChoTrong] = useState('');
    const [noidi, setNoiDi] = useState('');
    const [noiden, setNoiDen] = useState('');
    const [matuyen, setMaTuyen] = useState('');
    const [mataixe, setMaTaiXe] = useState('');
    const [maxe, setMaXe] = useState('');
    const [taixe, setTaiXe] = useState([]);
    const [xe, setXe] = useState([]);
    const [selectedTaiXe, setSelectedTaiXe] = useState('');
    const [selectedXe, setSelectedXe] = useState('');

    useEffect(() => {
        loadChuyenXeData();
        loadTaiXe();
        loadXe();
    }, [ChuyenXeID]);

    const loadChuyenXeData = async () => {
        try {
            const response = await API.get(`${endpoints['chuyenxe']}?q=${ChuyenXeID}`);
            const data = response.data.results;
            if (data && data.length > 0) {
                const chuyenXe = data[0];
                setID(chuyenXe.id);
                setName(chuyenXe.TenChuyenXe);
                setNgay(chuyenXe.Ngay);
                setGioDi(chuyenXe.Giodi);
                setGioDen(chuyenXe.Gioden);
                setChoTrong(chuyenXe.Cho_trong);
                setNoiDi(chuyenXe.Noidi);
                setNoiDen(chuyenXe.Noiden);
                setMaTaiXe(chuyenXe.Ma_TaiXe);
                setMaXe(chuyenXe.Ma_Xe);
                setMaTuyen(chuyenXe.Ma_Tuyen);

                await fetchTaiXeById(chuyenXe.Ma_TaiXe);
                await fetchXeById(chuyenXe.Ma_Xe);
            }
        } catch (error) {
            console.error('Error fetching Chuyen Xe data:', error);
        }
    };

    const fetchTaiXeById = async (id) => {
        try {
            const response = await API.get(`${endpoints['taixe']}?mataixe=${id}`);
            const taiXeData = response.data.results;
            if (taiXeData.length > 0) {
                setSelectedTaiXe(taiXeData[0].id);
            }
        } catch (error) {
            console.error('Error fetching Tai Xe data:', error);
        }
    };

    const fetchXeById = async (id) => {
        try {
            const response = await API.get(`${endpoints['xe']}?q=${id}`);
            const xeData = response.data;
            if (xeData) {
                setSelectedXe(xeData[0].id);
            }
        } catch (error) {
            console.error('Error fetching Xe data:', error);
        }
    };

    const handleTaiXeChange = (event) => {
        setSelectedTaiXe(event.target.value);
    };

    const handleXeChange = (event) => {
        setSelectedXe(event.target.value);
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
                } else if (page !== 0) {
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

    const handleBack = () => {
        navigate(`/chuyenxe/tuyen/${matuyen}`);
    };

    const updateChuyenXe = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            await API.put(`${endpoints['chuyenxe']}${ChuyenXeID}/Capnhat_ChuyenXe/`, {
                TenChuyenXe: name,
                Ngay: ngay,
                Ma_Tuyen: parseInt(matuyen),
                Giodi: gioDi,
                Gioden: gioDen,
                Cho_trong: chotrong,
                Noidi: noidi,
                Noiden: noiden,
                Ma_TaiXe: parseInt(selectedTaiXe || mataixe),
                Ma_Xe: parseInt(selectedXe || maxe),
            }, { headers });
            console.log('Chuyen Xe updated thành công');
            window.alert('Cập nhật thành công: Vui lòng quay lại trang Chuyến Xe để xem sự thay đổi.');
            navigate(`/chuyenxe/tuyen/${matuyen}`);
        } catch (error) {
            console.error('Lỗi updating Chuyen Xe:', error);
        }
    };

    const deleteChuyenXe = async () => {
        const confirmation = window.confirm('Bạn có chắc chắn muốn xóa Chuyen Xe này?');
        if (confirmation) {
            try {
                const token = localStorage.getItem('access_token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                const res = await API.delete(`${endpoints['chuyenxe']}${ChuyenXeID}/Xoa_ChuyenXe/`, { headers });
                if (res.status === 204) {
                    console.log('Chuyen Xe deleted thành công');
                    window.alert('Xóa thành công: Vui lòng quay lại trang Chuyến Xe để xem sự thay đổi.');
                    navigate(`/chuyenxe/tuyen/${matuyen}`);
                } else {
                    console.error('Không thể xóa Chuyen Xe');
                    window.alert('Không thể xóa Chuyen Xe. Vui lòng xóa sau giây lát.');
                }
            } catch (error) {
                console.error('Error:', error);
                window.alert('Lỗi xóa! Vui lòng thử lại sau');
            }
        }
    };

    return (
        <div className="container">
            <h1>Sửa Chuyến Xe</h1>
            <label>Tên chuyến xe:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
            />
            <label>Ngày:</label>
            <input
                type="text"
                value={ngay}
                onChange={(e) => setNgay(e.target.value)}
                className="input"
            />
            <label>Giờ Đi:</label>
            <input
                type="text"
                value={gioDi}
                onChange={(e) => setGioDi(e.target.value)}
                className="input"
            />
            <label>Giờ Đến:</label>
            <input
                type="text"
                value={gioDen}
                onChange={(e) => setGioDen(e.target.value)}
                className="input"
            />
            <label>Số lượng ghế:</label>
            <input
                type="text"
                value={chotrong}
                onChange={(e) => setChoTrong(e.target.value)}
                className="input"
            />
            <label>Nơi Đi:</label>
            <input
                type="text"
                value={noidi}
                onChange={(e) => setNoiDi(e.target.value)}
                className="input"
            />
            <label>Nơi Đến:</label>
            <input
                type="text"
                value={noiden}
                onChange={(e) => setNoiDen(e.target.value)}
                className="input"
            />
            <label>Tài Xế:</label>
            <select
                value={selectedTaiXe}
                onChange={handleTaiXeChange}
                className="input"
            >
            {taixe.map((c) => (
                <option key={c.id} value={c.id}>{c.Ten_taixe}</option>
            ))}
            </select>
            <label>Xe:</label>
            <select
                value={selectedXe}
                onChange={handleXeChange}
                className="input"
            >
                {xe.map((item) => (
                    <option key={item.id} value={item.id}>{item.Ten_xe}</option>
                ))}
            </select>
                <div className="button-container">
                    <button onClick={handleBack} className="button">Quay Lại</button>
                    <button onClick={deleteChuyenXe} className="button">Xóa</button>
                    <button onClick={updateChuyenXe} className="button">Cập nhật</button>
                </div>
            </div>
        );
    };
    
    export default SuaChuyenXe;