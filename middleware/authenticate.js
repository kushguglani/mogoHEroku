const {User} = require('./../models/user.js');
let authenticate = (request,response,next)=>{
    var token = request.header('x-auth');
    User.findByToken(token).then((user)=>{
        console.log(user);
        if(!user){
            return Promise.reject();
        }
        request.user = user;
        request.token = token;
        response.send(user);
    }) .catch((e)=>{
        response.status(401).send();
    })
}
module.exports= {authenticate};