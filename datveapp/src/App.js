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
import ThemCX from './component/ChuyenXe/ThemChuyenXe';
import SuaChuyenXe from './component/ChuyenXe/SuaChuyenXe';
import TaiXe from './component/TaiXe/TaiXe';
import ThemTaiXe from './component/TaiXe/ThemTaiXe';
import SuaTaiXe from './component/TaiXe/SuaTaiXe';
import TaiXeDetail from './component/TaiXe/DetailTX';
import Profile from './component/VeXe/Profile';
import KhachHang from './component/KhachHang/KhachHang';
import KhachHangDetail from './component/KhachHang/DetailKH';
import ThemKhachHang from './component/KhachHang/ThemKH';
import SuaKhachHang from './component/KhachHang/SuaKH';
import Footer from './component/Footer';
import VeXe from './component/VeXe/VeXe';

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
  console.log(user)
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
          <Header/>
          <Routes>
            <Route exact path="/home" element={<TrangChu />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/tuyenxe" element={<TuyenXe />} />
            <Route exact path='/chuyenxe/tuyen/:TuyenXeID' element={<ChuyenXe />} />
            <Route exact path='/chuyenxe/detail_chuyenxe/:ChuyenXeID' element={<ChuyenXeDetail />} />
            <Route exact path='/datve/:ChuyenXeID' element={<DatVe />} />
  

            {userRole === 1 && (
              <>
                <Route exact path="/registeradmin" element={<RegisterAdmin />} />
                <Route exact path='/profile' element={<Profile />} />
                <Route exact path="/nhanvien" element={<NhanVien />} />
                <Route exact path='/them_nhanvien' element={<ThemNV />} />
                <Route exact path='/sua_nhanvien/:idnv' element={<SuaNhanVien />} />
                <Route exact path='/detail_nhanvien/:id' element={<NhanVienDetail />} />
                <Route exact path="/taixe" element={<TaiXe />} />
                <Route exact path='/them_taixe' element={<ThemTaiXe />} />
                <Route exact path='/sua_taixe/:id_TaiXe' element={<SuaTaiXe />} />
                <Route exact path='/detail_taixe/:id_TaiXe' element={<TaiXeDetail />} />
                <Route exact path="/khachhang" element={<KhachHang />} />
                <Route exact path='/them_khachhang' element={<ThemKhachHang />} />
                <Route exact path='/sua_khachhang/:id_KH' element={<SuaKhachHang />} />
                <Route exact path='/detail_khachhang/:id_KH' element={<KhachHangDetail />} />
                <Route exact path="/them_tuyenxe" element={<ThemTuyenXe />} />
                <Route exact path='/sua_tuyenxe/:TuyenXeID' element={<SuaTuyenXe />} />
                <Route exact path='/them_chuyenxe/:TuyenXeID' element={<ThemCX />} />
                <Route exact path='/sua_chuyenxe/:ChuyenXeID' element={<SuaChuyenXe />} />
                <Route exact path='/thongkedoanhthu' element={<ThongKeDT />} />
                <Route exact path='/vexe' element={<VeXe />} />
              </>
            )}

            {userRole === 2 && (
              <>
                <Route exact path='/profile' element={<Profile />} />
                <Route exact path="/nhanvien" element={<NhanVien />} />
                <Route exact path='/detail_nhanvien/:id' element={<NhanVienDetail />} />
                <Route exact path="/them_tuyenxe" element={<ThemTuyenXe />} />
                <Route exact path='/sua_tuyenxe/:TuyenXeID' element={<SuaTuyenXe />} />
                <Route exact path='/them_chuyenxe/:TuyenXeID' element={<ThemCX />} />
                <Route exact path='/sua_chuyenxe/:ChuyenXeID' element={<SuaChuyenXe />} />
              </>
            )}

            {userRole === 3 && (
              <>
                <Route exact path='/profile' element={<Profile />} />
              </>
            )}

            {userRole === 4 && (
              <>
                <Route exact path='/profile' element={<Profile />} />
                <Route exact path="/chuyenxetaixe" element={<ChuyenXeTaiXe/>} />
              </>
            )}

          </Routes>
          <Footer/>
        </QueryClientProvider>
      </MyContext.Provider>
    </Router>
    </>
  );
}

export default App;
