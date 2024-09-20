import { Button, Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from "react";
import MyContext from "../config/MyContext";
import { Link } from "react-router-dom";
import './Header.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = () => {
    const [user, dispatch] = useContext(MyContext)

    const logout = () => {
        dispatch ({
            type: "logout"
        })
    }


    return(

        <>
            <div style={{ backgroundColor: '#FFC0CB' }}>
                <div style={{textAlign: 'center'}}>
                    <img 
                        src="/logobus.png"  // Đường dẫn tới logo  
                        alt="Logo"
                        style={{ height: '150px', marginBottom: '10px' }}                      
                    />
                </div>
                
                <div style={{textAlign: 'right', paddingRight: '20px'}}>
                    {user.user === null ? 
                        <>
                            <Button as={Link} to="/login" 
                                variant="outline-dark" 
                                className="rounded-pill"
                            >
                                <i className="bi bi-person-circle" style={{ width: '40px', height: '40px', marginRight: '10px' }}></i> 
                                ĐĂNG NHẬP/ ĐĂNG KÝ
                            </Button>
                        </> : <>
                            <Button  
                                variant="outline-dark" 
                                className="rounded-pill"
                                onClick={logout}
                            >
                                
                                <Image 
                                    src={user.user.avatar}
                                    alt="Avatar"
                                    roundedCircle
                                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                />
                                ĐĂNG XUẤT
                            </Button>
                        </>
                    }
                    
                </div>

                
            </div>   
            <Navbar expand="lg" className="navbar-nav" style={{ backgroundColor: '#FFC0CB' }}>
                <Container>
                  
                    {/* <Navbar.Brand 
                        href="/home" 
                        className={`navbar-brand-custom ${activeTab === '/' ? 'active' : ''}`}
                        onClick={() => handleSelect('/')}
                    >
                    TRANG CHỦ
                    </Navbar.Brand> */}

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    
                        {/* Menu */}
                        <Nav variant="underline" defaultActiveKey="/home">
                            {user.user === null ? <>
                                <Nav.Item>
                                    <Nav.Link href="/home" >
                                        TRANG CHỦ
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link href="/tuyenxe" >
                                        LỊCH TRÌNH
                                    </Nav.Link>
                                </Nav.Item>
                                
                                
                                
                            </> : <>
                                <Nav.Link as={Link} to="/home" className="px-3" style={{ fontWeight: 'bold', color: '#000' }}>
                                    TRANG CHỦ
                                </Nav.Link>
                                <Nav.Link as={Link} to="/tuyenxe" className="px-3" style={{ fontWeight: 'bold', color: '#000' }}>
                                    LỊCH TRÌNH
                                </Nav.Link>
                                <Nav.Link as={Link} to="/profile" className="px-3" style={{ fontWeight: 'bold', color: '#000' }}>
                                    TÀI KHOẢN
                                </Nav.Link>

                                {user.user && user.user.Loai_NguoiDung === 1 && (
                                    <>
                                        <Nav.Link as={Link} to="/vexe" className="px-3" style={{ fontWeight: 'bold', color: '#000' }}>
                                            TRA CỨU VÉ
                                        </Nav.Link>
                                        <NavDropdown title="NHÂN VIÊN" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={Link} to="/nhanvien">
                                                Danh sách nhân viên
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/them_nhanvien">
                                                Thêm nhân viên
                                            </NavDropdown.Item>
                                        </NavDropdown>

                                        <NavDropdown title="TÀI XẾ" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={Link} to="/taixe">
                                                Danh sách tài xế
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/them_taixe">
                                                Thêm tài xế
                                            </NavDropdown.Item>
                                        </NavDropdown>

                                        <NavDropdown title="KHÁCH HÀNG" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={Link} to="/khachhang">
                                                Danh sách khách hàng
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/them_khachhang">
                                                Thêm khách hàng
                                            </NavDropdown.Item>
                                        </NavDropdown>

                                        <NavDropdown title="KHÁC" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={Link} to="/registeradmin">
                                                Tạo tài khoản nhân viên
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/thongkedoanhthu">
                                                Thống kê doanh thu
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                )}

                                {user.user && user.user.Loai_NguoiDung === 4 && (
                                    <Nav.Link as={Link} to="/chuyenxetaixe" className="px-3" style={{ fontWeight: 'bold', color: '#000' }}>
                                        TRA CỨU CHUYẾN
                                    </Nav.Link>
                                )}
                            </>}
                            
                            
                        </Nav>

                        {}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
        
    )
}

export default Header;