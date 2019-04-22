var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  let database = req.app.get('database');
  let query = req.body;
  let username = query.username;
  let title = query.title;
  let category = query.category;
  let size = query.size;
  let details = query.details;
  let brand = query.brand;
  let color = query.color;
  let originalPrice = query.originalPrice;
  let currValue = query.currValue;
  let image1 = query.image1;
  let image2 = query.image2;
  let image3 = query.image3;
  let image4 = query.image4;

  let photoList = {};
  photoList.image1 = image1;
  photoList.image2 = image2;
  photoList.image3 = image3;
  photoList.image4 = image4;

  let listingInfo = {
    title: title,
    category: category,
    size: size,
    details : details,
    brand: brand,
    color: color,
    originalPrice: originalPrice,
    currValue: currValue,
    photos: photoList,
    creator: username,
    offerCount: 0
  };

  var newListingKey = database.ref().child('Listings').push().key;
  database.ref('/Listings/' + newListingKey).set(listingInfo);
  database.ref('/UserListings/' + username).push(newListingKey);
  res.send(newListingKey);
});

module.exports = router;
