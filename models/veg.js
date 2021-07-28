var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//month in an array because it can have multiple

var VegSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 50},
    species: {type: String, maxLength: 100},
    description: {type: String, maxLength: 999},
    sow: [{type: Schema.Types.ObjectId, ref: 'Month'}],
    harvest: [{type: Schema.Types.ObjectId, ref: 'Month'}],
    maturation: {type: Number},
    stock: {type: Number, min: 0, max: 999}
  }
);

VegSchema
.virtual('url')
.get(function() {
  return '/' + this._id;
});

module.exports = mongoose.model('Veg', VegSchema);
