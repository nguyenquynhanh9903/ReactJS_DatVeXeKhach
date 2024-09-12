import { useContext, useState } from "react";
import API, { authAPI, endpoints } from "../config/API";
import { useNavigate } from "react-router-dom";
import MyContext from "../config/MyContext";
import { Button, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle, Visibility } from "@mui/icons-material";

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()
    const dispatch = useContext(MyContext)
    const [loading, setLoading] = useState(false)

    const login = async () => {
        setLoading(true)

        try {
            let res = await API.post(endpoints['login'], {
                'client_id': 'soVvyOundObf8QKoPdtmuJ7FH1BiJVdJrIZc0XyI',
                'client_secret': '2pJvXYrVbDLriOP43IDFcsOHJR8HprY2PbKQ07RvXTQeCmeNWfdBGN8dqPWT93wk66Z44rLwKoQXxd9H0nbh5Yy60UyxO0ZVzJhhevcNU2gQ7MpzJl7eqnHT6dM2UOlp',
                'username': username,
                'password': password,
                'grant_type': 'password'
            }, 

            {
                headers: {
                    'content-Type': 'application/x-www-form-urlencoded'
                }
            })
            console.info(res.data);
    
            localStorage.setItem('access_token', res.data.access_token)

            const authAxios = authAPI(res.data.access_token)
    
            const user = await authAxios.get(endpoints['current-user'])
            console.log(user.data)
            
            dispatch({
                type: 'login',
                payload: user.data
            })
            nav('/')

        } catch(ex) {
            console.error(ex);
        } finally {
            setLoading(false)
        }
        
    }

    return (
        <>

            <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
                <h1 style={{ marginTop: '80px', marginBottom: '50px', textAlign: 'center' }}>ĐĂNG NHẬP</h1>
                <TextField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên đăng nhập..."
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <AccountCircle />
                            </InputAdornment>
                        ) 
                    }}
                />
                <TextField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Mật khẩu..."
                    fullWidth
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <Visibility />
                                </IconButton>
                            </InputAdornment>
                        ) 
                    }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: '60px', width: '100%' }}
                    onClick={login}
                    disabled={loading}
                >
                {loading ? <CircularProgress size={24} /> : 'ĐĂNG NHẬP'}
                </Button>
            </div>

            
        </>
    )
}

export default Login;