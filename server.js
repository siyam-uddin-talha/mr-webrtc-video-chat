const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");
const AuthRoute = require("./backend/Routes/AuthRoute");
const CheckCredentials = require("./backend/Middlewares/CheckCredentials");

require("dotenv").config();

// **********  initalize database ********
require("./backend/controllers/db");
// **********  initalize database ********

const app = express();

app.use(cors());

app.use(cookieParser());
app.use(express.json());

app.get("/api/user", CheckCredentials);
app.use("/api/auth", AuthRoute);

// front-end
app.use(express.static(path.join(__dirname, "./frontend/build")));
// front-end index file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log("server is running on port ", +PORT)
);

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (users[roomID]) {
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
    socket.broadcast.emit("user left", socket.id);
  });
});
