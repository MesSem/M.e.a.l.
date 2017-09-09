// =======================
// API ROUTES 
// =======================
var express     = require('express');
var config      = require('../../config');    // get our config file

var api_utilities=require('./api-utilities');

var adminRoutes = express.Router(); 
var apiRoutes = express.Router();
module.exports = apiRoutes;




/* ======================================== 
  Login of a user, params:
   { name:"", password:""}  
*/
apiRoutes.post('/authenticate', function(req, res)
           {
              var name = req.body.name;
              var psw  = req.body.password;
               // controllo parametri
              if (!name || !psw)
                  {
                    res.status(400).json({ success: false, 
                               message: 'Bad Request. name and password required.' });  
                  }
               // esecuzione funzione
              api_utilities.login(name, psw)
                    .then(function(token)
                      {
                        res.status(201).json({success: true, 
                                              message: 'Enjoy your token!', 
                                              data: {'token':token}});
                      })
                    .catch(function(err)
                      { res.status(400).json({ success: false, 
                                               code: err.code,
                                               message: err.msg 
                                              }); });
            });           



/* ======================================== 
  Signup of a user, params:
   { name:"", password:""}  
*/
apiRoutes.post('/signup', function(req, res)
            {
              var name = req.body.name;
              var psw  = req.body.password;
              // controllo parametri
              if (!name || !psw)
                  {
                    res.status(400).json({ success: false, 
                               message: 'Bad Request. name and password required.' });  
                  } 
               // esecuzione funzione    
              api_utilities.addUser(name, psw)
                    .then(function(user)
                      {
                       res.status(201).json({ success: true , msg:"utente salvato", data:user});
                      })
                    .catch(function(err)
                      {
                         res.status(400).json({ success: false , 
                                                code:err.code,
                                                msg:err.msg, 
                                                data:""}); 
                      });
            });


