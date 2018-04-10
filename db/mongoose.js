const mongoose = require('mongoose');
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === "DEV"){
    mongoose.connect('mongodb://localhost:27017/TodoApp');
}
else if(process.env.NODE_ENV === "PROD"){
     mongo_url = 'mongodb://kush:123456@ds011800.mlab.com:11800/kush';
}

module.exports = {mongoose};