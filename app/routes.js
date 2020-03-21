const express     = require('express');
const bodyParser  = require('body-parser');
const session     = require('express-session');
const passport    = require('passport');
const mongo       = require('mongodb').MongoClient;
const ObjectID    = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');

module.exports = function (app, db) {
  
  function ensureAuthenticated(req, res, next) {
          if (req.isAuthenticated()) {
              return next();
          }
          res.redirect('/');
        };
  
  app.route('/auth/github')
          .get(passport.authenticate('github'),(req,res) => { 
    
  });
  
        
  app.route('/auth/github/callback')
  .get(passport.authenticate('github', { title: "Home Page", failureRedirect: '/' }), (req,res) => { 
    
    console.log("In /Login");
    res.redirect('/profile'); 
  });
 
      
      
    app.route('/chat')
      .get(ensureAuthenticated, (req, res) => {
        console.log(req.session);
           res.render(process.cwd() + '/views/pug/chat', {user: req.user});
      });
        /**/
   
       /* */
      
      
        app.route('/')
          .get((req, res) => {
            res.render(process.cwd() + '/views/pug/index');
          });

       app.route('/profile')
         .get(ensureAuthenticated, (req, res) => {
         
            console.log("In /Profile");
            res.render(process.cwd() + '/views/pug/profile', {user: req.user,  showLogin: true, showRegistration: true});
      });

        app.route('/logout')
          .get((req, res) => {
              req.logout();
              res.redirect('/');
          });

        app.use((req, res, next) => {
          res.status(404)
            .type('text')
            .send('Not Found');
        });
      
        app.route('/register')
  .post((req, res, next) => {
      db.collection('users').findOne({ username: req.body.username }, function (err, user) {
          if(err) {
              next(err);
          } else if (user) {
              res.redirect('/');
          } else {
              db.collection('users').insertOne(
                {username: req.body.username,
                 password: req.body.password},
                (err, doc) => {
                    if(err) {
                        res.redirect('/');
                    } else {
                        next(null, user);
                    }
                }
              )
          }
       })}
)}
  
        
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  