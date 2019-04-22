var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let database = req.app.get('database');
  let query = req.query;
  let username = query.username;
  let listingId = query.listingId;
  let time = query.time;

  let offerRef = database.ref('/Offers/' + listingId);
  offerRef.once('value').then(function(snapshot) {
    let offers = snapshot.val();
    for(let key in offers){
      let offer = offers[key];
      let offerMaker = offer.offerMaker;
      let notificationInfo = {
        listingTitle: offer.title,
        time: time,
        type: "offerDeleted",
        status: "new"
      }
      database.ref('/Notifications/' + offerMaker).push(notificationInfo);
    }
  });

  let offerRef2 = database.ref("/Offers/");
  offerRef2.once('value').then(function(snapshot) {
    let offerGroups = snapshot.val();
    for(let id in offerGroups){
      let offers = offerGroups[id];
      for(let key in offers){
        let offer = offers[key];
        if(offer.listingId == listingId){
          database.ref("/Offers/" + id + "/" + key).remove();
        }
      }
    }
  });

  userOfferRef = database.ref("/UserOffers/" + username);
  userOfferRef.once('value').then(function(snapshot) {
      let offers = snapshot.val();
      for(let key in offers){
        let offer = offers[key];
        if(offer.listingOfferId == listingId){
          database.ref('/UserOffers/' + username + "/" + key).remove();
        }
      }
  });

  userOfferRef2 = database.ref("/UserOffers/");
  userOfferRef2.once('value').then(function(snapshot) {
      let offerGroups = snapshot.val();
      for(let username in offerGroups){
        let offers = offerGroups[username];
        for(let key in offers){
          let offer = offers[key];
          if(offer.listingId == listingId){
            database.ref('/UserOffers/' + username + "/" + key).remove();
          }
        }
      }
  });

  userListingRef = database.ref("/UserListings/" + username);
  userListingRef.once('value').then(function(snapshot) {
      let listings = snapshot.val();
      for(let key in listings){
        let id = listings[key];
        if(listingId == id){
          database.ref("/UserListings/" + username + "/" + key).remove();
        }
      }
  });

  database.ref("/Listings/" + listingId).remove();

  res.send("listing deleted");
});

module.exports = router;
