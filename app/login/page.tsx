'use client'
import Box from "@mui/material/Box";
import {Button, TextField, Typography} from "@mui/material";
import {ChangeEvent, useState} from "react";
import axios from "axios";
import http from "@/common/http";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";


export default function Page() {
    const [cookies, setCookie] = useCookies(['tk'])
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const setPass = (event: any)=>{
        setPassword(event.target.value)
    }
    const setUser = (event: any)=>{
        setUserName(event.target.value)
    }
    const loginFunc = async () => {
        const data = {
            username: userName,
            password: password
        }
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_API}/api/token-auth`, data)
            if (res.data && res.data.token) {
                setCookie('tk', res.data.token)
                router.push('/')
            } else {
                alert('Login failed')
            }
        } catch (e) {
            alert('Login failed')
        }
    }

    return (
        <Box sx={{
            width:'200vh',
            height:'100vh',
            backgroundColor:'#f0f0f0',
            display: 'flex',
            alignItems:'center',
            flexDirection: 'column',
            paddingTop: '30px',
            justifyContent: 'center'
        }}>
            <Box sx={{
                height:'60vh',
                borderRadius: '8px',
                margin: 'auto',
                width: '35%',
                padding: '50px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems:'center',
                flexDirection: 'column',
                paddingTop: '30px',
            }}>
                <Box
                    sx={{
                        marginTop: '20px',
                        // width: '50%'
                    }}
                >
                    <Typography variant={'h3'} color="secondary">Quizz login</Typography>
                </Box>
                <Box sx={{
                    marginTop: '30px',
                    width: '50%'
                }}>
                    <TextField
                        label={"username"}
                        id="username"
                        variant="filled"
                        color="secondary"
                        margin="normal"
                        focused
                        fullWidth
                        onChange={(event)=>{setUser(event)}}
                    />
                </Box>
                <Box sx={{
                    // marginTop: '20px'
                    width: '50%'
                }}>
                    <TextField
                        // id="filled-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="filled"
                        color="secondary"
                        margin="normal"
                        focused
                        fullWidth
                        onChange={(event)=>{setPass(event)}}

                    />
                </Box>
                <Box sx={{
                    marginTop: '20px'
                }}>
                    <Button
                        color={'secondary'}
                        size={'large'}
                        variant='contained'
                        sx={{
                            color:'#ffffff'
                        }}
                        onClick={()=>{loginFunc()}}
                    >
                        Sign in
                    </Button>
                </Box>
            </Box>

        </Box>
    )
}
