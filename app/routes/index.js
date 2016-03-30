var express = require('express');
var router = express.Router();
var artistData = require('./artist_wrapper.json');
var i = 0; // artist index
//console.log(artistData);
console.log(artistData.artist[i].influences);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { name: artistData.artist[i].artistName, decade: artistData.artist[i].yearsActive, influences:artistData.artist[i].influences });
});

module.exports = router;
/*
C:\Users\Owner\Desktop\inspire
*/