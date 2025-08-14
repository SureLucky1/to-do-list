const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    date: String,
    task: Array,
},
//以下是幫collection命名
{
  collection: "Task",
});
//以下是以today 去 export TaskSchema
module.exports = mongoose.model('today', TaskSchema);
