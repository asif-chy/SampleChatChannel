'use strict';

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const auth        = require('./app/auth.js');
const routes      = require('./app/routes.js');
const mongo       = require('mongodb').MongoClient;
const cookieParser= require('cookie-parser')
const passport    = require('passport');
const sessionStore= new session.MemoryStore();
const app         = express();
const http        = require('http').Server(app);
const io          = require('socket.io')(http);
const passportSocketIo = require("passport.socketio");
const cors        = require('cors');

fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.set('view engine', 'pug')
app.use(cors())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));

    app.use(passport.initialize());
    app.use(passport.session());


// Create a new MongoClient
const client = new mongo(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect( (err, client) => {
   const db = client.db('Cluster0');
    if(err)         console.log('Database error: ' + err);
   
/*mongo.connect(process.env.DATABASE, (err, db) => {
    if(err) console.log('Database error: ' + err); */
  
    auth(app, db);   
    routes(app, db);
   
 
http.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);        }); 
  
      io.use(passportSocketIo.authorize({
      cookieParser: cookieParser,
      key:          'express.sid',
      secret:       process.env.SESSION_SECRET,
      store:        sessionStore
    }));
 var currentUsers = 0;  
  io.on('connection', (socket) => {
     // console.log((socket));  
             console.log('A user has connected');  
             ++currentUsers;
           io.emit('user count', {name: socket.request.user.name, currentUsers:currentUsers, connected: true});  
    
           io.emit('user', {name: socket.request.user.name, currentUsers, connected: true});
           
       /* --currentUsers;
        io.emit('disconnect', currentUsers);*/
 socket.on('chat message', (message) => {

        io.emit('chat message', {name: socket.request.user.name, message:message});

      });

         socket.on('disconnect', (user) => {
        io.emit('disconnect', user);
        console.log( socket.request.user.name + ' has left the chat.');
    });
//onsole.log('user ' + socket.request.user.name + ' connected')
    });

    //end socket.io code
  
});




