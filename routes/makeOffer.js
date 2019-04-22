var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let database = req.app.get('database');
  let query = req.query;
  let listingId = query.listingId;
  let listingTitle = query.listingTitle;
  let listingOffer = query.listingOffer;
  let listingOfferTitle = query.listingOfferTitle;
  let offerMaker = query.offerMaker;
  let creator = query.creator;
  let time = query.time;

  let offerInfo = {
    listingId: listingOffer,
    listingTitle: listingOfferTitle,
    title: listingTitle,
    offerMaker: offerMaker
  }

  let notificationInfo = {
    listingId: listingOffer,
    listingTitle: listingTitle,
    offerMaker: offerMaker,
    time: time,
    type: "offerReceived",
    status: "new"
  }

  let userOfferInfo = {
    listingId: listingId,
    listingTitle: listingTitle,
    listingOfferId: listingOffer,
  }

  let offerCountRef = database.ref('/Listings/' + listingId + "/offerCount");
  offerCountRef.once('value').then(function(snapshot) {
    let offerCount = snapshot.val();
    let updateOfferCount = (parseInt(offerCount) + 1).toString();
    database.ref('/Listings/' + listingId + "/offerCount").set(updateOfferCount);
    database.ref('/Offers/' + listingId).push(offerInfo);
    database.ref('/Notifications/' + creator).push(notificationInfo);
    database.ref('/UserOffers/' + offerMaker).push(userOfferInfo);
    res.send("offer submitted");
  });
});

module.exports = router;
