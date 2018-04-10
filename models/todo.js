const mongoose = require('mongoose');

let Todo = mongoose.model('Todo',{
    text:{
        type:String,
        required:true,
        minlength:1
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default : new Date().getTime()
    }
});

module.exports = {Todo};
