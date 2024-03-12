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


//letting the player choose which player they want to be (colour)
io.on('connection', (socket) => {
  //just checking they are in fact, there
  console.log('a user has connected spooky');

  // treating both players as rooms cause idk
  //if they choose the same group they both win cause friendship <3 (thats the work together option they only pass if they do over 50% of the page)
  socket.on('pickPlayer1', player1 => {
    // join player 1
    socket.join(player1);
    console.log('user is player 1');
    console.log(socket.rooms);
  });
  
  //for player 2
  socket.on('pickPlayer2', player2 => {
    // join player 2
    socket.join(player2);
    console.log('user is player 2');
    console.log(socket.rooms);
  });

  //getting the room
  // if (socket.rooms.has('player1')) {
  //   console.log('playerrrrr1');
  // }

  // if (socket.rooms.has('player2')) {
  //   console.log('playerrrrr2');
  // }


  //get player number
  socket.on('getPlayer', () => {
    socket.emit('players', Array.from(socket.rooms));
  });

  // //looking for drawing actions from the user
  socket.on('draw', (data) => {
    //emit shows the drawing to everyone
    socket.broadcast.emit('draw', data);
  });
  
  // broadcast to all player 1
  io.to('player1').emit('message', 'you will draw in red.  Get as much as you can in 1 minute!');

  // broadcast to all player 2
  io.to('player2').emit('message', 'you will draw in blue.  Get as much as you can in 1 minute!');


  // leave the room
  // socket.leave('player 1');

  socket.on('disconnect', () => console.log('the user is gone oh noes'));

});


server.listen(1111, () => {
  console.log('server running at http://localhost:1111');
});