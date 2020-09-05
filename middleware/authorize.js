let secret = "abc";
const express = require('express')
const app = express()
let jwt = require('jsonwebtoken');


let CheckToken = (req, res, next) => {
    let token = req.headers.token;
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.json({ "error": "invalid token" })
        req.body.studentId = user.studentId;
        req.body.email = user.email;
        req.body.password = user.password;
        next();
    })
}
module.exports = CheckToken;