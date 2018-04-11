var env = process.env.NODE_ENV || "DEVELOPMENT" ;
console.log(env);
if(env === "DEVELOPMENT"){
    process.env.PORT = 4000;
    process.env.MONGO_URI = 'mongodb://localhost:27017/TodoApp';
}
else if(env === "test"){
    process.env.PORT = 4000;
    process.env.MONGO_URI = 'mongodb://localhost:27017/TodoAppTest';
}
else if(env === "PROD"){
    process.env.MONGO_URI = 'mongodb://kush:123456@ds011800.mlab.com:11800/kush';
}