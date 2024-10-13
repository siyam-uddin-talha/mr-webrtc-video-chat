import React, { useCallback, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import { Box, Stack } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AppHeader() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { login } = useSelector((state) => state.UserReducer);

  const GetUser = useCallback(async () => {
    try {
      const res = await fetch(`/api/user`, {
        credentials: "include",
      });
      const response = await res.json();

      if (!response.success) {
        dispatch({ type: `USER_FAIL` });
        return;
      }
      dispatch({ type: `USER_SUCCESS`, payload: response.user });
    } catch (error) {
      console.log(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    GetUser();
  }, [GetUser, dispatch]);

  const handleUser = async () => {
    try {
      if (login) {
        const res = await fetch(`/api/auth/logout`);
        const response = await res.json();
        if (response.success) window.location = "/";
      } else {
        history.push("/user/login");
      }
    } catch (error) {}
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          borderBottom: "none",
        }}
      >
        <Toolbar>
          <Link to="/" className="nav_home_link " style={{ flexGrow: 1 }}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <img src="/sutio.png" alt="logo" />
            </Stack>
          </Link>
          <Button color="inherit" onClick={handleUser}>
            {login ? "Log out" : "Login"}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
