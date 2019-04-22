var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  let database = req.app.get('database');
  let query = req.body;
  let username = query.username;
  let password = query.password;
  let profileURL = query.profileURL;

  var userInfo = {
    password: password,
    profileURL: profileURL
  }

  database.ref('/Users/' + username).set(userInfo);
  res.send(username);
});

module.exports = router;
