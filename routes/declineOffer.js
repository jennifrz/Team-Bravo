var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let database = req.app.get('database');
  let query = req.query;
  let username = query.username;
  let listingId = query.listingId;
  let listingTitle = query.listingTitle;
  let listingOfferId = query.listingOfferId;
  let offerMaker = query.offerMaker;
  let time = query.time;

  let notificationInfo = {
    listingId: listingId,
    listingTitle: listingTitle,
    user: username,
    time: time,
    type: "offerDeclined",
    status: "new"
  }

  database.ref('/Notifications/' + offerMaker).push(notificationInfo);
  let offerRef = database.ref('/Offers/' + listingId);
  offerRef.once('value').then(function(snapshot) {
    let offers = snapshot.val();
    for(let key in offers){
      let offer = offers[key];
      if(offer.listingId == listingOfferId){
        database.ref('/Offers/' + listingId + "/" + key).remove();
      }
    }
  });

  let userOfferRef = database.ref('/UserOffers/' + offerMaker);
  userOfferRef.once('value').then(function(snapshot) {
    let offers = snapshot.val();
    for(let key in offers){
      let offer = offers[key];
      if(offer.listingId == listingId){
        database.ref('/UserOffers/' + offerMaker + "/" + key).remove();
      }
    }
  });

  let offerCountRef = database.ref('/Listings/' + listingId + "/offerCount");
  offerCountRef.once('value').then(function(snapshot) {
    let offerCount = snapshot.val();
    let updateOfferCount = (parseInt(offerCount) - 1).toString();
    database.ref('/Listings/' + listingId + "/offerCount").set(updateOfferCount);
  });

  res.send("offer declined");
});

module.exports = router;
