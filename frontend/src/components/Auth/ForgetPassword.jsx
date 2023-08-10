import * as React from "react";
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
import ShowAlert from "../More/ShowAlert";

const theme = createTheme();

export default function ForgetPassword() {
  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const res = await UsePostData("/api/auth/forget/password", {
        email: data.get("email"),
      });

      if (res.data.success) {
        setMessage({
          open: true,
          message: res.data.message,
        });
      } else {
        setMessage({
          open: true,
          message: res.data.message,
        });
      }
    } catch (error) {
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
            Forget password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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

            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              send Reset email
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/user/login" variant="body2">
                  Login
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
      </Container>
    </ThemeProvider>
  );
}
