/* eslint-disable no-console */
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import http from 'http';
import bodyParser from 'body-parser';
import api from './src/api/';
import config from './webpack.config';
import firebase from 'firebase';
import dbconfig from './dbconfig';
import socketio from 'socket.io';

firebase.initializeApp(dbconfig);


const port = process.env.PORT || 3000;

const app = express();
const compiler = webpack(config);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.use('/api', api);
app.use('/static', express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening at http://localhost:${port}`);
});

const io = socketio.listen(server); 
// let rooms = [];
// io.on('connection', function(socket){
//   let trigger = 0; 
//   socket.on('newuser', function(newuser) { 
//     for(let i = 0; i < rooms.length; i++){
//       if(rooms[i].length<2){
//         if (rooms[i].length === 0||(rooms[i].length === 1 && rooms[i][0].user != newuser)){
//           rooms[i].push({user: newuser, socket: socket});
//           trigger = 1 ;
//         }
//       }
//     }
//     if (!trigger){
//       rooms.push([{user: newuser, socket: socket}]);
//     }
//   }); 
//   socket.on('mysnake', function(data) { 
//     for(let i = 0; i < rooms.length; i++){
//       for(let j = 0; j < rooms[i].length; j++){
//         if(data.user === rooms[i][j].user){
//           if (j === 0  ){
//             if (rooms[i].length === 2){ 
//               rooms[i][1].socket.emit('enemy', data);
//             }
//           }
//           else {
//             rooms[i][0].socket.emit('enemy', data);
//           }
//         }
//       }
//     }
//   });  
// });
let buffer = [];
let rooms  = {};
io.on('connection', function(socket){
  socket.on('newuser', function(newuser) { 
    buffer.push({user : newuser, socket : socket});

    if (buffer.length === 2 ){
      rooms[buffer[0].user] = buffer[1];
      rooms[buffer[1].user] = buffer[0];
      buffer = [];
    } 
  }); 
  socket.on('game', function(data) { 
    if (buffer.length === 1 && buffer[0].user === data.user)
      socket.emit('mysnake', data);
    else {
      rooms[data.user].socket.emit('enemy', data);
      socket.emit('mysnake', data);
    }
  });  
  socket.on('dicoonect', function(data) { 
    let myuser = rooms[data.user].user;
    delete rooms[data.user];
    delete rooms[myuser];
  });

});
