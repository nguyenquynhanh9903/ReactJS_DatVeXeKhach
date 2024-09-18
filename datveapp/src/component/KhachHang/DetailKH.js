import { useContext, useEffect, useState } from "react";
import MyContext from "../../config/MyContext";
import { useNavigate } from "react-router-dom";
import API, { endpoints } from "../../config/API";
import './styles.css';

const KhachHang = () => {
    const [state] = useContext(MyContext);
    const nav = useNavigate();
    const [khachhang, setKhachHang] = useState(false);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const loadKH = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url;
                if (!isNaN(q)) {
                    url = `${endpoints['khachhang']}?ma_khachhang=${q}&page=${page}`;
                } else {
                    url = `${endpoints['khachhang']}?q=${q}&page=${page}`;
                }

                const token = localStorage.getItem('access_token');

                let headers = {
                    'Authorization': `Bearer ${token}`
                };
                
                let res = await API.get(url, { headers });

                if (page === 1) {
                    setKhachHang(res.data.results);
                } else if (page !== 0) {
                    setKhachHang(current => [...current, ...res.data.results]);
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
        loadKH()
    }, [q, page])

    const isCloseToBottom = (event) => {
        const { clientHeight, scrollTop, scrollHeight } = event.target;
        const paddingToBottom = 20;
        return clientHeight + scrollTop >= scrollHeight - paddingToBottom;
    }

    const loadMore = (event) => {
        if (!loading && !isFetchingMore && page > 0 && isCloseToBottom(event)) {
            setIsFetchingMore(true);
            setPage(page + 1);
        }
    }

    const goToHome = () => {
        nav('/home')
    }

    const goToDetail = (id_KH) => {
        nav(`/detail_khachhang/${ id_KH }`)
    }

    const search = (value) => {
        setPage(1)
        setQ(value)
    }

    return (
        <>
            <div className="container">
                <div style={{ marginTop: 10 }}>
                    <input
                        type="text"
                        placeholder="Nhập id hoặc tên của khách hàng..."
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
                    {khachhang && khachhang.map(c => (
                        <div 
                            onClick={() => goToDetail(c.id)} 
                            key={c.id} 
                            className="list-item"
                        >
                            <div className="list-item-content">
                                <img 
                                    className="avatar" 
                                    src={c.avatar}
                                    alt={c.Ten_KH}
                                />
                                <div className="list-item-text">
                                    <h3>{c.Ten_KH}</h3>
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
        </>
    )
}

export default KhachHang;