import React, { useCallback, useEffect, } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

export default function AppHeader() {

    const dispatch = useDispatch()
    const history = useHistory()

    const { login } = useSelector(state => state.UserReducer)

    const GetUser = useCallback(async () => {
        try {

            const res = await fetch(`/api/user`, {
                credentials: 'include'
            })
            const response = await res.json()

            if (response.message === 'not login') {
                dispatch({ type: `USER_FAIL`, })
            } else {
                dispatch({ type: `USER_SUCCESS`, payload: response.user })
            }

        } catch (error) {
            console.log(error.message)
        }

    }, [dispatch]
    )

    useEffect(() => {
        GetUser()
    }, [GetUser, dispatch])


    const handleUser = async () => {
        try {
            if (login) {
                const res = await fetch(`/api/auth/logout`)
                const response = await res.json()
                if (response.success) window.location = '/'
            } else {
                history.push("/user/login")
            }
        } catch (error) {

        }

    }


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{
                background: '#021426',
                color: 'white',
                boxShadow: 'none',
                borderBottom: "1px solid rgb(1 28 54)"
            }}  >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Mr
                    </Typography>
                    <Button color="inherit" onClick={handleUser} >
                        {login ? "Log out" : "Login"}
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
