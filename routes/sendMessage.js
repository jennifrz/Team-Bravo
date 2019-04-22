var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let database = req.app.get('database');
  let query = req.query;
  let username = query.username;
  let userSendTo = query.userSendTo;
  let messageContent = query.messageContent;
  let time = query.time;

  let messageInfo1 = {
    content: messageContent,
    time: time,
    status: 'send'
  }

  let messageInfo2 = {
    content: messageContent,
    time: time,
    status: 'receive'
  }

  database.ref('/Messages/' + username + "/" + userSendTo).push(messageInfo1);
  database.ref('/Messages/' + userSendTo + "/" + username).push(messageInfo2);

  res.send("message sent");
});

module.exports = router;
