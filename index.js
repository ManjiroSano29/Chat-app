const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {v4: uuidV4} = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const user = {};

io.on('connection', (socket) => {
  socket.on('new-user', myName => {
    user[socket.id] = myName;
    socket.broadcast.emit('user-connected', myName);
});
  
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', user[socket.id]);
    delete user[socket.id];
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/chat', (req, res) => {
  res.render('index');
});

app.get('/videoCall', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('video-call', {roomId: req.params.room});
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId); 
    socket.broadcast.emit('video-connected', userId);
    
  });
});

server.listen('3000', () => {
  console.log('start');
});


