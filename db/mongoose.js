const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI);

// console.log(process.env.NODE_ENV);
// if(process.env.NODE_ENV === "DEV"){
//     mongoose.connect('mongodb://localhost:27017/TodoApp');
// }
// else if(process.env.NODE_ENV === "PROD"){
//      mongo_url = 'mongodb://kush:123456@ds011800.mlab.com:11800/kush';
//     mongoose.connect(mongo_url);
// }

module.exports = {mongoose};