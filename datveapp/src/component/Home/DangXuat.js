import { useContext } from "react";
import MyContext from "../config/MyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Logout = () => {
    const [user, dispatch] = useContext(MyContext)
    const nav = useNavigate()

    const logout = () => {
        dispatch ({
            type: "logout"
        })
        nav('/');
    }

    const goToLogin = () => {
        nav('/login');
    }

    if (user === null) {
        return (
            <Button style={{backgroundColor: "#BF6B7B", margin: 10}}
            onClick={goToLogin}>Đăng nhập</Button>
        )
    }

    return (
        <Button
        style={{ backgroundColor: "#BF6B7B", margin: 10 }} // Thiết lập màu và margin
        onClick={logout} // Sử dụng onClick cho các sự kiện của nút
        >
            Đăng xuất
        </Button>
    )
}

export default Logout;