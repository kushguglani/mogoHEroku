const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:1,
        validate : {
            validator: validator.isEmail,
            message : '{VALUE} is not a valid email'
        }
    },
    password :{
        type:String,
        minlength:6,
        required:true
    },
    tokens :[{
        access : {
            type:String,
            required:true
        },
        token : {
            type:String,
            required:true
        }
    }]
})

UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject,['_id','email']);

}

UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'kushiskhush').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
}
UserSchema.statics.findByToken = function(token){
    let User = this;
    let decoded;
    try{
        decoded = jwt.verify(token,'kushiskhush');
    }
    catch(e){
        // return new Promise((resolve,reject)=>{
        //     reject();
        // });
        //    or
        return Promise.reject();
    }
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

let User = mongoose.model('User',UserSchema);
module.exports = {User};