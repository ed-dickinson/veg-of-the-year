var Veg = require('../models/veg');
var Month = require('../models/month');

var async = require('async');

exports.index = function(req, res){
  async.parallel({
    veg_count: function(callback) {
      Veg.countDocuments({}, callback);
    },
    month_count: function(callback) {
      Month.countDocuments({}, callback);
    },
    months: function(callback) {
      Month.find().exec(callback);
    },
    vegs: function(callback) {
      Veg.find().exec(callback);
    },
  }, function (err, results) {
    res.render('index', {title: 'Veg of the World', error: err, data: results});
  });
};

exports.veg_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Veg list');
};

// Display detail page for a specific Genre.
exports.veg_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Veg detail: ' + req.params.name);
};

exports.month_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Month list');
};
