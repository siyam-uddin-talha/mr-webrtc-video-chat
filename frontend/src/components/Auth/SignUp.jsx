import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UsePostData from '../../api/UsePostData'
import { useHistory } from 'react-router';
import validator from 'validator';
import { Link } from 'react-router-dom';
import ShowAlert from '../More/ShowAlert';
import BackDropLoading from '../More/BackDropLoading';
import { useDispatch } from 'react-redux';




const theme = createTheme();

export default function SignUp() {

    const history = useHistory()

    const dispatch = useDispatch()

    const [backDropLoading, setBackDropLoading] = useState(false)

    const [message, setMessage] = React.useState({
        open: false,
        message: ''
    })


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const firstName = data.get('firstName')
        const lastName = data.get('lastName')
        const email = data.get('email')
        const password = data.get('password')

        if (!firstName || !lastName || !email || !password) {
            setMessage({
                open: true,
                message: 'Please fill the input'
            })
            return;
        }
        if (!validator.isEmail(email) || email.split("@")[0].length < 5) {
            setMessage({
                open: true,
                message: 'Please enter a valid email'
            })
            return;
        }

        if (password.length < 8) {
            setMessage({
                open: true,
                message: 'Your Password should be more then 8'
            })
            return;
        }
        setBackDropLoading(true)

        try {
            const { data } = await UsePostData('/api/auth/register', {
                firstName,
                lastName,
                email,
                password,
            })

            if (data.success) {
                setBackDropLoading(false)
                dispatch({ type: "USER_SUCCESS", payload: data.response })
                history.push('/')
            }
            else if (data.message === `user exist! try to login`) {
                setBackDropLoading(false)

                setMessage({
                    open: true,
                    message: 'use already exist! try new one'
                })
            }
            else {
                setBackDropLoading(false)

                setMessage({
                    open: true,
                    message: 'Error try to refresh'
                })
            }

        } catch (error) {
            setBackDropLoading(false)

            setMessage({
                open: true,
                message: 'Error try to refresh'
            })
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    label="First Name"
                                    id="firstName"
                                    autoFocus
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Last Name"
                                    id="lastName"
                                    name="lastName"
                                    autoComplete="family-name"
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    variant="standard"
                                />
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/user/login">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <ShowAlert open={message.open} setClose={setMessage} message={message.message} />
                {backDropLoading && <BackDropLoading />}
            </Container>

        </ThemeProvider>
    );
}