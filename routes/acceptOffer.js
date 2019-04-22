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
    type: "offerAccepted",
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

  let userOfferRef2 = database.ref('/UserOffers/' + username);
  userOfferRef2.once('value').then(function(snapshot) {
    let offers = snapshot.val();
    for(let key in offers){
      let offer = offers[key];
      if(offer.listingId == listingId){
        database.ref('/UserOffers/' + username + "/" + key).remove();
      }
    }
  });


  let listing1Ref = database.ref('/Listings/' + listingId);
  listing1Ref.once('value').then(function(snapshot) {
    let listing = snapshot.val();
    let image1 = listing.photos.image1;
    let title = listing.title;
    let swappedListing1Info = {
      image: image1,
      title: title
    }
    database.ref('/SwappedListings/' + username).push(swappedListing1Info);
    database.ref("/Listings/" + listingId).remove();
  });

  let listing2Ref = database.ref('/Listings/' + listingOfferId);
  listing2Ref.once('value').then(function(snapshot) {
    let listing = snapshot.val();
    let image1 = listing.photos.image1;
    let title = listing.title;
    let swappedListing2Info = {
      image: image1,
      title: title
    }
    database.ref('/SwappedListings/' + offerMaker).push(swappedListing2Info);
    database.ref("/Listings/" + listingOfferId).remove();

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

  userListingRef2 = database.ref("/UserListings/" + offerMaker);
  userListingRef2.once('value').then(function(snapshot) {
      let listings = snapshot.val();
      for(let key in listings){
        let id = listings[key];
        if(listingOfferId == id){
          database.ref("/UserListings/" + offerMaker + "/" + key).remove();
        }
      }
  });

  res.send("offer accepted");
});

module.exports = router;
