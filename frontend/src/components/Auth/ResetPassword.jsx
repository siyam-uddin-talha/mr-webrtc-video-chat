import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import UsePostData from "../../api/UsePostData";
import { useHistory, useParams } from "react-router";

import ShowAlert from "../More/ShowAlert";
import { Button } from "@mui/material";

const theme = createTheme();

export default function ResetPassword() {
  const { resetToken } = useParams();

  const [buttonDisable, setButtonDisable] = React.useState(false);

  const history = useHistory();

  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const password = data.get("password");
    const ConfirmPassword = data.get("confirmPassword");

    if (ConfirmPassword.length < 8 || password.length < 8) {
      setMessage({
        open: true,
        message: "Your Password should be more then 8",
      });
      return;
    }
    if (ConfirmPassword !== password) {
      setMessage({
        open: true,
        message: `password don't same`,
      });
      return;
    }

    try {
      setButtonDisable(true);
      const res = await UsePostData(`/api/auth/reset/password/${resetToken}`, {
        password: ConfirmPassword,
      });
      if (res.data.success) {
        history.push("/user/login");
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
          <form onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-confirmPassword"
              variant="standard"
            />
            <Button
              disabled={buttonDisable}
              type="submit"
              variant="outlined"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Reset password
            </Button>
          </form>
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
