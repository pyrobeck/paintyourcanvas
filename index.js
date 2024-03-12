const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


//emit shows it to everyone
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

//letting the player choose which player they want to be (colour)
io.on('connection', (socket) => {
  // join the room named 'some room'
  socket.join('player 1');
  
  // broadcast to all connected clients in the room
  io.to('player 1').emit('you are player one and will draw in red');

  // leave the room
  socket.leave('player 1');
});

server.listen(1111, () => {
  console.log('server running at http://localhost:1111');
});