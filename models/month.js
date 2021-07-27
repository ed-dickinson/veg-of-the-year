var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//season in an array because it can have multiple
var MonthSchema = new Schema(
  {
    name: {type: String, required: true,
    },

    old_english: {type: String, maxLength: 200}
  }
);

MonthSchema
.virtual('url')
.get(function() {
  return '/' + this._id;
});

module.exports = mongoose.model('Month', MonthSchema);
