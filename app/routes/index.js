var express = require('express');
var router = express.Router();
var artistData = require('./artist_wrapper.json');
var artists = require('artist-data');
var i = 0; // artist index

/* GET home page. */
router.get('/', function(req, res, next) {
 // Test render data
  res.render('index', { name: artistData.artist[i].artistName, decade: artistData.artist[i].yearsActive, influences:artistData.artist[i].influences });
});
router.get('/select', function(req, res, next) {
  // Selection and inputs
  //res.render('inputs', { allArtists: artists });
  res.render('selectionLayout', { allArtists: artists });
});
router.get('/test', function(req, res, next) {
  res.render('testSelection', { allArtists: artists });
});
module.exports = router;