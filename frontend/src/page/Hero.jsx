import { Button, Container, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import { useSelector } from "react-redux";

const Hero = () => {
  const history = useHistory();

  const { login } = useSelector((state) => state.UserReducer);

  const [pathName, setpathName] = React.useState("");

  function CreateNewRoom() {
    if (login) {
      const id = uuid();
      history.push(`/new/room/${id}`);
    } else {
      history.push("/user/login");
    }
  }

  const HandleJoinTheSpacificRoom = () => {
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
                onClick={() => CreateNewRoom()}
              >
                + New one
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
                  onClick={HandleJoinTheSpacificRoom}
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
    </section>
  );
};

export default Hero;
