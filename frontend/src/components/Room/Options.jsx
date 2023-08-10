import { Container, IconButton, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { BsMic, BsCameraVideo, BsThreeDotsVertical } from "react-icons/bs";
import CallEndOutlinedIcon from "@mui/icons-material/CallEndOutlined";
import { useParams } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import { Box } from "@mui/system";
import { useHistory } from "react-router";

const Options = ({ stream }) => {
  const history = useHistory();

  const { roomID } = useParams();

  const [clipordOpen, setclipordOpen] = useState(false);

  const handleMic = () => {
    if (stream && stream.srcObject)
      stream.srcObject.getTracks().forEach(function (track) {
        if (track.kind === "audio" && track.enabled) {
          // track.stop();
          track.enabled = false;
        } else if (track.kind === "audio" && !track.enabled) {
          // track.stop();
          track.enabled = true;
        }
      });
    else {
      return;
    }
  };

  const handleCam = () => {
    if (stream && stream.srcObject)
      stream.srcObject.getTracks().forEach(function (track) {
        if (track.kind === "video" && track.enabled) {
          // track.stop();
          track.enabled = false;
        } else if (track.kind === "video" && !track.enabled) {
          // track.stop();
          track.enabled = true;
        }
      });
    else {
      return;
    }
  };

  const handleclipbordOpen = () => {
    setclipordOpen(true);
  };

  const handleHangout = () => {
    history.replace("/");
  };

  const CopyToClipBord = () => {
    const body = document.querySelector("body");

    const area = document.createElement("textarea");
    body.appendChild(area);

    area.value = window.location.href;
    area.select();
    area.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(window.location.href);
    document.execCommand("copy");

    body.removeChild(area);
    setclipordOpen(false);
  };

  const optionGrout = [
    { icon: <BsMic />, fun: handleMic },
    { icon: <BsCameraVideo />, fun: handleCam },
    { icon: <CallEndOutlinedIcon />, fun: handleHangout },
    { icon: <BsThreeDotsVertical />, fun: handleclipbordOpen },
  ];

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#000d1a",
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ pb: 2 }}>
          <div className="wrapper_ option_wrapper d-flex j-c-s-b">
            {optionGrout.map((item, index) => {
              return (
                <IconButton
                  key={index}
                  onClick={() => item.fun()}
                  color="secondary"
                >
                  {item.icon}
                </IconButton>
              );
            })}
          </div>
        </Container>
      </Box>

      <div className="snackbar_container">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={clipordOpen}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => CopyToClipBord()}
            >
              <FiCopy fontSize="big" />
            </IconButton>
          }
          message={`copy code : https://..${roomID.substr(0, 8)}...`}
        />
      </div>
    </>
  );
};

export default Options;
