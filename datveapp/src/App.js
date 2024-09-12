import Login from './component/Home/DangNhap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Register from './component/Home/DangKy';
import TuyenXe from './component/TuyenXe/TuyenXe';
import TrangChu from './component/Home/Home';
import Header from './component/Header';
import { useEffect, useReducer, useState } from 'react';
import NhanVien from './component/NhanVien/NhanVien';
import ChuyenXeTaiXe from './component/TaiXe/ChuyenXeTX';
import MyContext from './config/MyContext';
import RegisterAdmin from './component/Home/DangKyAdmin';
import { QueryClient, QueryClientProvider } from 'react-query';
import ThemTuyenXe from './component/TuyenXe/ThemTuyenXe';
import SuaTuyenXe from './component/TuyenXe/SuaTuyenXe';
import ThongKeDT from './component/ThongKe/ThongKeDT';
import ThemNV from './component/NhanVien/ThemNV';
import SuaNhanVien from './component/NhanVien/SuaNV';
import NhanVienDetail from './component/NhanVien/DetailNV';
import DatVe from './component/DatVe/DatVe';
import ChuyenXe from './component/ChuyenXe/ChuyenXe';
import ChuyenXeDetail from './component/ChuyenXe/DetailChuyenXe';

const initialState = {user: null}

const reducer = (state, action) => {
  switch(action.type) {
    case 'login':
      return {...state, user:action.payload}
    case 'logout':
      return {...state, user: null}
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [userRole, setUserRole] = useState(null)
  const {user} = state
  const queryClient = new QueryClient()

  useEffect(() => {
    if (user) {
      setUserRole(user.Loai_NguoiDung)
    } else {
      setUserRole(null)
    }
  }, [user])

  return (
    <>
    <Router>
      <MyContext.Provider value={[state, dispatch]}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Routes>
            <Route exact path="/home" element={<TrangChu />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/tuyenxe" element={<TuyenXe />} />
            <Route exact path='/chuyenxe' element={<ChuyenXe />} />
            <Route exact path='/detail_chuyenxe' element={<ChuyenXeDetail />} />
            <Route exact path='/datve/:ChuyenXeID' element={<DatVe />} />
  

            {userRole === 1 && (
              <>
                <Route exact path="/nhanvien" element={<NhanVien />} />
                <Route exact path='/them_nhanvien' element={<ThemNV />} />
                <Route exact path='/sua_nhanvien' element={<SuaNhanVien />} />
                <Route exact path='/detail_nhanvien' element={<NhanVienDetail />} />
                <Route exact path="/registeradmin" element={<RegisterAdmin />} />
                <Route exact path="/them_tuyenxe" element={<ThemTuyenXe />} />
                <Route exact path='/sua_tuyenxe/:TuyenXeID' element={<SuaTuyenXe />} />
                <Route exact path='/thongkedoanhthu' element={<ThongKeDT />} />
              </>
            )}

            {((userRole === 2) || (userRole === 3)) && (
              <>
                <Route exact path='/detail_nhanvien' element={<NhanVienDetail />} />
                <Route exact path="/them_tuyenxe" element={<ThemTuyenXe />} />
                <Route exact path='/sua_tuyenxe/:TuyenXeID' element={<SuaTuyenXe />} />
              </>
            )}

            {userRole === 4 && (
              <>
                <Route exact path="/chuyenxetaixe" element={<ChuyenXeTaiXe/>} />
              </>
            )}

          </Routes>
        </QueryClientProvider>
      </MyContext.Provider>
    </Router>
    </>
  );
}

export default App;
