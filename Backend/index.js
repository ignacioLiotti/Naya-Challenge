const express = require('express');
const app = express();
const morgan = require("morgan");
const path = require('path');
const cors = require('cors');

app.use(morgan('tiny'));
const corsConfig = {
  origin: 'http://localhost:3000'
}

app.use(cors(corsConfig));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build'  + '/index.html'));
})

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

let onlineUsers = [];

io.on('connection', (socket) => {    
  console.log('User connected', socket.id);
  // User connection
  socket.on('userConnected', (user) => {
    console.log('///////////');
    console.log("ONLINE USERS") 
    console.log(onlineUsers)
    const parsedUser = JSON.parse(user);
    if (!onlineUsers.some(user => user.email === parsedUser?.email)){
    onlineUsers = [...onlineUsers, {
      email: parsedUser?.email,
      socketId: socket.id
    }]
    };
    io.emit("newUser", user)
  })
  // User disconnection
  socket.on("disconnect", () => {
    onlineUsers = [...onlineUsers.filter(user => user.socketId !== socket.id)]
    console.log("ONLINE USERS") 
    console.log(onlineUsers)
  });

  socket.on('lineDrawed', (image) => {
    socket.broadcast.emit("sendLine", image);
  })
  socket.on('cleanCanvas', () => {
    socket.broadcast.emit("cleanCanvas");
  })
})