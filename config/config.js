var env = process.env.NODE_ENV || "DEVELOPMENT" ;
console.log(env);

if(env ==="DEVELOPMENT" || env ==="TEST"){
    var configObject = require('./config.json');
    console.log(configObject);
    var envConfig = configObject[env];
    console.log(Object.keys(envConfig));
    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    })
    console.log(process.env.PORT);
    console.log(process.env.MONGO_URI);
    console.log(process.env.JWT_SECRET);
}

// if(env === "DEVELOPMENT"){
//     process.env.PORT = 4000;
//     process.env.MONGO_URI = 'mongodb://localhost:27017/TodoApp';
// }
// else if(env === "TEST"){
//     process.env.PORT = 4000;
//     process.env.MONGO_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
// else if(env === "PROD"){
//     process.env.MONGO_URI = 'mongodb://kush:123456@ds011800.mlab.com:11800/kush';
// }