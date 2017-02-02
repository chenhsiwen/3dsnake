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
let buffer = [];
let rooms  = {};

io.on('connection', function(socket){
  socket.on('newuser', function(newuser) { 
    if (buffer.length === 0||(buffer.length === 1 && buffer[0].user !== newuser))
      buffer.push({user : newuser, socket : socket});
    if (buffer.length === 2 ){
      rooms[buffer[0].user] = buffer[1];
      rooms[buffer[1].user] = buffer[0];
      buffer = [];
    } 
  }); 
  socket.on('game', function(data) { 
    socket.emit('mysnake', data);
    if (rooms[data.user]) {
      rooms[data.user].socket.emit('enemy', data);
      socket.emit('mysnake', data);
    }
  });  
  socket.on('disconnect', function(data) {
    if (rooms[data.user]) {
      let enemy = rooms[data.user].user;
      delete rooms[enemy];
      delete rooms[data.user];  
    }
    if (buffer.length === 1 && buffer[0].user === data.user){
      buffer = [];
    }
  });

});