const mongoose = require('mongoose');

const RegularTaskSchema = new mongoose.Schema({
  date: String,
    task: Array,
},
//以下是幫collection命名
{
  collection: "RegularTask",
});
//以下是以today 去 export TaskSchema
module.exports = mongoose.model('regular', RegularTaskSchema);
