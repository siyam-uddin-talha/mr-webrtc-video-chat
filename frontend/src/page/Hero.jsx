import { Button, Container, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import UseGetData from "../api/UseGetData";
import ShowAlert from "../components/More/ShowAlert";

const Hero = () => {
  const history = useHistory();

  const { login } = useSelector((state) => state.UserReducer);

  const [pathName, setpathName] = React.useState("");
  const dispatch = useDispatch();
  const [message, setMessage] = React.useState({
    open: false,
    message: "",
  });

  async function createNewRoom() {
    try {
      if (login) {
        const id = uuid();
        history.push(`/new/room/${id}`);
      } else {
        const { data } = await UseGetData(`/api/auth/ontap`);

        if (data.success) {
          setMessage({
            open: true,
            message: data.message,
          });
          dispatch({ type: "USER_SUCCESS", payload: data.response });
          const id = uuid();
          history.push(`/new/room/${id}`);
          return;
        }
        setMessage({
          open: true,
          message: data.message,
        });
      }
    } catch (error) {}
  }

  const handleJoinTheSpacificRoom = () => {
    const roomIdSplit = pathName.split("/");
    const onlyId = roomIdSplit[roomIdSplit.length - 1];

    if (login) {
      if (pathName) history.push(`/new/room/${onlyId}`);
    } else {
      history.push("/user/login");
    }
  };

  return (
    <section className="s-pad hero_banner">
      <Container component="main" className="d-flex f-w-w a-i-c gap-5 j-c-s-b">
        <Box sx={{ py: 5, width: { md: "45%", sm: "80%", xs: "100%" } }}>
          <Box>
            <h1>Meet your team, friends, partner</h1>
            <span>Audio, video, chat are free</span>
          </Box>
          <Box className="d-flex gap-3 mt-4">
            <div className="create_new_chat">
              <Button
                className="h-100"
                variant="contained"
                color="primary"
                onClick={() => createNewRoom()}
              >
                {login ? "+ New meet" : "+ One tap join"}
              </Button>
            </div>
            <div className="join_new-chat d-flex gap-2">
              <div className="input_fild">
                <TextField
                  id="outlined-basic"
                  label="Ender code to join"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => setpathName(e.target.value)}
                  value={pathName}
                />
              </div>
              <div className="button_container">
                <Button
                  className="h-100"
                  color="primary"
                  onClick={handleJoinTheSpacificRoom}
                >
                  Join
                </Button>
              </div>
            </div>
          </Box>
        </Box>
        <Box sx={{ width: { md: "45%", sm: "80%", xs: "100%" } }}>
          <Box className="image_container p-4" sx={{ width: "90%" }}>
            <img src="/images/chat.svg" alt="" className="img-fluid" />
          </Box>
          <div className="info">
            <h3>Get link and share</h3>
            <span>share the link and meet with people</span>
          </div>
        </Box>
      </Container>
      <ShowAlert
        open={message.open}
        setClose={setMessage}
        message={message.message}
      />
    </section>
  );
};

export default Hero;
