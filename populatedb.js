#! /usr/bin/env node

console.log('This script populates your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');
//node populatedb mongodb+srv://ed:fruitadmin@cluster0.frbsi.mongodb.net/fruit_inventory?retryWrites=true&w=majority

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Veg = require('./models/veg')
var Month = require('./models/month')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var vegs = []
var months = []

function monthCreate(name, old_english, cb) {
  monthdetail = {name:name}
  if (old_english != false) monthdetail.old_english = old_english

  var month = new Month(monthdetail);

  month.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Month: ' + month);
    months.push(month)
    cb(null, month)
  }  );
}

function vegCreate(name, species, description, sow, harvest, maturation, stock, cb) {
  vegdetail = {
    name: name,
    species: species,
    description: description,
    sow: sow,
    harvest: harvest,
    maturation: maturation,
    stock: stock
  }
  if (description != false) vegdetail.description = description

  var veg = new Veg(vegdetail);
  veg.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Veg: ' + veg);
    vegs.push(veg)
    cb(null, veg)
  }  );
}

function findMonths(cb) {
  Month.find().exec(cb);
}

function createMonths(cb) {
    async.series([
        function(callback) {
          monthCreate('January', 'After Yule', callback);
        },
        function(callback) {
          monthCreate('February', 'Mud Month', callback);
        },
        function(callback) {
          monthCreate('March', 'Month of Wildness',  callback);
        },
        function(callback) {
          monthCreate('April', 'Easter Month',  callback);
        },
        function(callback) {
          monthCreate('May', 'Month of Three Milkings',  callback);
        },
        function(callback) {
          monthCreate('June', 'Before Midsummer',  callback);
        },
        function(callback) {
          monthCreate('July', 'After Midsummer',  callback);
        },
        function(callback) {
          monthCreate('August', 'Weed Month',  callback);
        },
        function(callback) {
          monthCreate('September', 'Holy Month',  callback);
        },
        function(callback) {
          monthCreate('October', "Winter's Full Moon",  callback);
        },
        function(callback) {
          monthCreate('November', 'Month of Sacrifice',  callback);
        },
        function(callback) {
          monthCreate('December', 'Before Yule',  callback);
        }
        ],
        // optional callback
        cb);
}


function createVegs(cb) {
    async.parallel([
        function(callback) {
          vegCreate('Beetroot', 'Beta vulgaris', "A leafy plant with a bright red taproot, treasured for it's juice.",
          [months[2],months[3],months[4],months[5],months[6]], [months[5],months[6],months[7],months[8],months[9]],
          55, 1, callback);
        },
        function(callback) {
          vegCreate('Courgette', 'Cucurbita pepo', "A vining herbaceous plant whose fruit are harvested when their immature seeds and rind are still soft and edible.",
          [months[3],months[4],months[5]],
          [months[5],months[6],months[7],months[8],months[9]],
          55, 1, callback);
        }

        ],
        // optional callback
        cb);
}



async.series([
    createMonths,
    // findMonths,
    createVegs
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Vegs: '+vegs);

    }
    // All done, disconnect from database
    mongoose.connection.close();
});
