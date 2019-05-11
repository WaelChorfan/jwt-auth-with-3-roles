var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: ["a", 1, 'r', 18.9] }, 'shhhhh');


const v = jwt.verify(token, 'shhhhh')

const d = new Date(v.iat * 1000)

console.log(d.toISOString())