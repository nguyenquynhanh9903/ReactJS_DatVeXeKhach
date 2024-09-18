import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API, { endpoints } from '../../config/API';
import MyContext from '../../config/MyContext';

const ChuyenXeDetail = () => {
    const navigate = useNavigate();
    const { ChuyenXeID } = useParams();
    const [searchParams] = useSearchParams();
    const Gia = searchParams.get('Gia');
    const [state] = useContext(MyContext);
    const { user } = state;
    const [chuyenxe, setChuyenXe] = useState([]);
    const [comments, setComments] = useState([]);
    const [contextCom, setContextCom] = useState('');
    const [viewComments, setViewComments] = useState(false);

    useEffect(() => {
        const fetchChuyenXeDetail = async () => {
            try {
                const res = await API.get(`${endpoints['chuyenxe']}?q=${ChuyenXeID}`);
                setChuyenXe(res.data.results);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load Chuyen Xe details.');
            }
        };

        const loadComments = async () => {
            try {
                if (!ChuyenXeID) {
                    console.error('ChuyenXeID không hợp lệ');
                    return;
                }
        
                const res = await API.get(`/ChuyenXe/${ChuyenXeID}/comments/`);
                if (res.data && res.data.results) {
                    setComments(res.data.results);
                } else {
                    console.error('Cấu trúc dữ liệu phản hồi không hợp lệ:', res.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải bình luận:', error);
                toast.error('An error occurred while loading comments.');
            }
        };
        
        fetchChuyenXeDetail();
        loadComments();
    }, [ChuyenXeID]);

    const addComment = async () => {
        try {
            if (!contextCom) {
                toast.warning('Please enter comment content.');
                return;
            }

            if (!chuyenxe || !user) {
                toast.info('Data is loading, please wait...');
                return;
            }

            let accessToken = localStorage.getItem("access_token");
            let res = await API.post(endpoints['them_comment'](ChuyenXeID), {
                'content': contextCom
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setComments([res.data, ...comments]);
            setContextCom('');
            toast.success('Comment added successfully.');
        } catch (error) {
            console.error('Error:', error.message);
            toast.error('An error occurred while adding the comment.');
        }
    };

    const cancelComment = () => {
        setContextCom(''); 
    };

    const formDate = (date) => {
        return moment(date, 'YYYY/MM/DD').format('DD/MM/YYYY');
    }

    const formDateComment = (date) => {
        return moment(date).format('DD/MM/YYYY HH:mm:ss');
    }

    const isChuyenXeExpired = (ngayChuyenXe) => {
        const now = new Date();
        const chuyenXeDate = new Date(ngayChuyenXe);
        return chuyenXeDate < now;
    };

    const handleBack = (TuyenXeID) => {
        navigate(`/chuyenxe/tuyen/${TuyenXeID}`);
    };

    const handleBook = (ChuyenXeID, Gia) => {
        navigate(`/dat_ve/${ChuyenXeID}?Gia=${Gia}`);
    };

    const handleEdit = (ChuyenXeID) => {
        navigate(`/suachuyenxe/${ChuyenXeID}`);
    };

    return (
        <div style={styles.container}>
            <div>
                {chuyenxe && chuyenxe.map(c => (
                    <div key={c.id} style={styles.detailContainer}>
                        <h2 style={styles.title}>Chuyến Xe {c.TenChuyenXe}</h2>
                        <div style={styles.infoItem}>
                            <span style={styles.label}>Ngày khởi hành:</span>
                            <span>{formDate(c.Ngay)}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.label}>Điểm Khởi Hành:</span>
                            <span>{c.Noidi}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.label}>Điểm Đến:</span>
                            <span>{c.Noiden}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.label}>Thời Gian Khởi Hành:</span>
                            <span>{c.Giodi}</span>
                        </div>
                        <div style={styles.infoItem}>
                            <span style={styles.label}>Giá vé:</span>
                            <span>{Gia}</span>
                        </div>
                        <div style={styles.buttonContainer}>
                            {!isChuyenXeExpired(c.Ngay) ? (
                                <button
                                    onClick={() => handleBook(c.id, Gia)}
                                    style={styles.button}
                                >
                                    Đặt vé
                                </button>
                            ) : (
                                <button
                                    onClick={() => setViewComments(true)}
                                    style={styles.button}
                                >
                                    Bình luận
                                </button>
                            )}
                            {user && user.Loai_NguoiDung === 1 && (
                                <button
                                    onClick={() => handleEdit(c.id)}
                                    style={styles.button}
                                >
                                    Sửa
                                </button>
                            )}
                            <button
                                onClick={() => handleBack(c.Ma_Tuyen)} 
                                style={styles.button}
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {viewComments && (
                <div style={styles.commentSection}>
                    <div style={styles.commentInputContainer}>
                        {user ? (
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                style={styles.avatar}
                            />
                        ) : null}
                        <input
                            type="text"
                            placeholder="Viết bình luận..."
                            value={contextCom}
                            onChange={(e) => setContextCom(e.target.value)}
                            style={styles.commentInput}
                        />
                        <button onClick={addComment} style={styles.button}>Thêm</button>
                        <button onClick={cancelComment} style={styles.cancelButton}>Hủy</button>
                    </div>
                    {comments.length === 0 ? (
                        <div style={styles.loading}>Loading...</div>
                    ) : (
                        <div>
                            {comments.map((c) => (
                                <div key={c.id} style={styles.commentItem}>
                                    <img
                                        src={c.user.avatar}
                                        alt="Avatar"
                                        style={styles.avatar}
                                    />
                                    <div style={styles.commentContent}>
                                        <div style={styles.commentAuthor}>{`${c.user.first_name} ${c.user.last_name}`}</div>
                                        <div>{c.content}</div>
                                        <div style={styles.commentDate}>{formDateComment(c.created_date)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    detailContainer: {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
    },
    title: {
        color: '#BF6B7B',
        marginBottom: '10px'
    },
    infoItem: {
        marginBottom: '10px'
    },
    label: {
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginTop: '10px'
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#BF6B7B',
        color: 'white',
        cursor: 'pointer',
        margin: '5px',
        fontSize: '16px'
    },
    cancelButton: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: 'red',
        color: 'white',
        cursor: 'pointer',
        margin: '5px',
        fontSize: '16px'
    },
    commentSection: {
        marginTop: '20px',
        borderTop: '1px solid #ddd',
        paddingTop: '20px'
    },
    commentInputContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
    },
    commentInput: {
        flex: 1,
        borderWidth: '1px',
        borderColor: 'gray',
        borderRadius: '5px',
        padding: '8px',
        marginRight: '10px',
        backgroundColor: '#F2CED5'
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '10px'
    },
    loading: {
        textAlign: 'center',
        fontStyle: 'italic'
    },
    commentItem: {
        display: 'flex',
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#fff'
    },
    commentContent: {
        flex: 1
    },
    commentAuthor: {
        fontWeight: 'bold'
    },
    commentDate: {
        fontSize: '12px',
        color: '#777'
    }
};

export default ChuyenXeDetail;