import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../../config/API";
import './styles.css'

const TaiXe = () => {
    const navigate = useNavigate()
    const [taixe, setTaiXe] = useState([])
    const [loading, setLoading] = useState(false)
    const [q, setQ] = useState("")
    const [page, setPage] = useState(1)
    const [isFetchingMore, setIsFetchingMore] = useState(false)

    const loadTX = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url;

                if (!isNaN(q)) {
                    url = `${endpoints['taixe']}?mataixe=${q}&page=${page}`;
                } else {
                    url = `${endpoints['taixe']}?q=${q}&page=${page}`;
                }

                const token = localStorage.getItem('access_token')

                let headers = {
                    'Authoriztion': `Bearer ${token}`
                }

                let res = await API.get(url, { headers });

                if (page === 1) {
                    setTaiXe(res.data.results);
                } else if(page !== 0) {
                    setTaiXe(current => [...current, ...res.data.results]);
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
        loadTX()
    }, [q, page])

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
    }

    const loadMore = ({nativeEvent}) => {
        if (!loading && !isFetchingMore && page > 0 && isCloseToBottom(nativeEvent)) { // Kiểm tra isFetchingMore
            setIsFetchingMore(true); // Đặt isFetchingMore thành true khi bắt đầu tải thêm dữ liệu
            setPage(page + 1);
        }
    }

    const goToHome = () => {
        navigate('/home')
    }

    const gotoDetail = (idTaiXe) => {
        navigate(`/detail_taixe/${ idTaiXe }`)
    }

    const search = (value) => {
        setPage(1);
        setQ(value);
    }

    return (
        <>
            <div className="container">
                <div style={{ marginTop: 10 }}>
                    <input
                        type="text"
                        placeholder="Nhập id hoặc tên của tài xế..."
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
                    {taixe && taixe.map(c => (
                        <div 
                            onClick={() => gotoDetail(c.id)} 
                            key={c.id} 
                            className="list-item"
                        >
                            <div className="list-item-content">
                                <img 
                                    className="avatar" 
                                    src={c.avatar}
                                    alt={c.Ten_taixe}
                                />
                                <div className="list-item-text">
                                    <h3>{c.Ten_taixe}</h3>
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

export default TaiXe;