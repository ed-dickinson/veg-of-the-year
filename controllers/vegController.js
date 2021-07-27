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

// exports.month_detail = function(req, res) {
//     res.send('NOT IMPLEMENTED: Month list for ' + req.params.name);
// };

exports.month_detail = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: month detail: ' + req.params.name);

    async.waterfall([
        function(callback) {
            Month.findOne({ 'name': req.params.name })
              .populate('month')
              .exec(
                function(err, month) {
                  callback(null, month)
                });
        },

        function(month, callback) {
            Veg.find({ 'sow' : month.id})
              .populate('veg')
              .exec(
                function(err, sow_veg){
                  callback(null, {sow_veg, month});
                });
        },
        function({sow_veg, month}, callback) {
            Veg.find({ 'harvest' : month.id})
              .populate('veg')
              .exec(
                function(err, harvest_veg){
                  callback(null, {harvest_veg, sow_veg, month});
                });
        },

    ],
     function(err, results) {
        if (err) { return next(err); }
        if (results==null) { // No results.
            var err = new Error('Month not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('month_detail', { title: results.month.name, month: results.month, sow_veg: results.sow_veg, harvest_veg: results.harvest_veg } );
    });
};
