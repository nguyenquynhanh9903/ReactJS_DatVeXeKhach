import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { authAPI, endpoints } from '../../configs/API';
import MyContext from '../../configs/MyContext';
import './css/styles.css'; 

const NhanVien = () => {
    const [state] = useContext(MyContext);
    const navigate = useNavigate();
    const { user } = state;
    const [nhanvien, setNhanVien] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const loadNV = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url;
                if (!isNaN(q)) {
                    url = `${endpoints['nhanvien']}?ma_nhanvien=${q}&page=${page}`;
                } else {
                    url = `${endpoints['nhanvien']}?q=${q}&page=${page}`;
                }

                const token = localStorage.getItem('access_token');

                let headers = {
                    'Authorization': `Bearer ${token}`
                };
                
                let res = await API.get(url, { headers });

                if (page === 1) {
                    setNhanVien(res.data.results);
                } else if (page !== 0) {
                    setNhanVien(current => [...current, ...res.data.results]);
                }
                if (res.data.next === null) {
                    setPage(0);
                }
            }
            catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
                setIsFetchingMore(false);
            }
        }
    }

    useEffect(() => {
        loadNV();
    }, [q, page]);

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

    const goToHome = () => {
        navigate('/');
    }

    const gotoDetail = (idNV) => {
        navigate(`/detail_nv/${idNV}`);
    }

    const search = (value) => {
        setPage(1);
        setQ(value);
    }

    return (
        <div className="container">
            <div style={{ marginTop: 10 }}>
                <input
                    type="text"
                    placeholder="Nhập id hoặc tên của nhân viên..."
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
                {nhanvien && nhanvien.map(c => (
                    <div 
                        onClick={() => gotoDetail(c.id)} 
                        key={c.id} 
                        className="list-item"
                    >
                        <div className="list-item-content">
                            <img 
                                className="avatar" 
                                src={c.avatar}
                                alt={c.Ten_NV}
                            />
                            <div className="list-item-text">
                                <h3>{c.Ten_NV}</h3>
                                <p>{c.Email}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="button-container">
                    <button className="button" style={{ width: 150 }} onClick={goToHome}>
                        Quay lại
                    </button>
                </div>
                {loading && page > 1 && <div className="loading">Loading...</div>}
            </div>
        </div>
    );
}

export default NhanVien;