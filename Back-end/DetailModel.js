const mongoose = require('mongoose');

const detailSchema = new mongoose.Schema({
    date: String,
    taskDetail: Array,
},
//以下是幫collection命名
{
  collection: "TaskDetail",
});
//以下是以today 去 export TaskSchema
module.exports = mongoose.model('todayDetail', detailSchema);
