const {ObjectID} = require('mongodb');
const {mongoose} = require('./../db/mongoose.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');

let id = '6aca71974f55cf0710bd601';
if(!ObjectID.isValid(id)){
    return console.log("Id not valid");
}
// User.find({_id:id}).then((users)=>{
//     console.log(users);
// });
// User.findOne({_id:id}).then((users)=>{
//     console.log(users);
// });
User.findById(id).then((user)=>{
    if(!user){
        return console.log("User not exist");
    }
    console.log(user);
})
.catch((e)=> console.log(e));