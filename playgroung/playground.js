const jwt = require('jsonwebtoken');
var data = {
    id:20
}
let token = jwt.sign(data,'kushisalwayskhush');
console.log(token);