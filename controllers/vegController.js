var Veg = require('../models/veg');
var Month = require('../models/month');

var async = require('async');

const {body,validationResult} = require('express-validator');

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

exports.veg_list = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Veg list');
    Veg.find()
    .select('name species description')
    .exec(function (err, vegs) {
      if (err) {return next(err);}
      res.render('veg_list', {title: 'Veg List', vegs: vegs})
    })
};

exports.veg_detail = function(req, res, next) {
  async.parallel({
    veg: function(callback) {
      Veg.findOne({'name' : req.params.name})
      .populate('sow', 'name')
      .populate('harvest', 'name')
      .exec(callback);
    },
    months: function(callback) {
      Month.find()
      .select('name')
      .exec(callback);
    },
  },  function(err, results) {
      if (err) {return next(err);}
        if (results.veg==null) {
          var err = new Error('Veg not found');
          err.status = 404;
          return next(err);
        }
        res.render('veg_detail', {title: results.veg.name, veg: results.veg, months: results.months});
    });
};

exports.veg_create_get = function(req,res,next) {
  Month.find().exec(function(err, months){
      if (err) {return next(err);}
      res.render('veg_form', {title: 'Add a new Vegetable', months: months});
    });
}

exports.veg_create_post = function(req,res,next) {
  res.send('NOT IMPLEMENTED: veg create POST');
}


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
