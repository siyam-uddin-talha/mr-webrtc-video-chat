import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import UsePostData from "../../api/UsePostData";
import { useHistory } from "react-router";
import ShowAlert from "../More/ShowAlert";
import BackDropLoading from "../More/BackDropLoading";

const theme = createTheme();

export default function SignIn() {
  const [backDropLoading, setBackDropLoading] = useState(false);

  const history = useHistory();

  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBackDropLoading(true);

    const data = new FormData(event.currentTarget);
    try {
      const res = await UsePostData("/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      });

      if (res.data.success) {
        setBackDropLoading(false);

        history.push("/");
      } else {
        setBackDropLoading(false);

        setMessage({
          open: true,
          message: res.data.message,
        });
      }
    } catch (error) {
      setBackDropLoading(false);

      setMessage({
        open: true,
        message: error.message,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="standard"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="standard"
            />

            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/user/forget-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/user/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <ShowAlert
          open={message.open}
          setClose={setMessage}
          message={message.message}
        />
        {backDropLoading && <BackDropLoading />}
      </Container>
    </ThemeProvider>
  );
}
