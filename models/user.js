const mongoose = require('mongoose');

let User = mongoose.model('User',{
    // name:{
    //     type:String,
    //     required:true,
    //     minlength:1
    // },
    email:{
        type:String,
         required:true,
    }
    // location:{
    //     type:Number,
    //     default : new Date().getTime()
    // }
});
module.exports = {User};