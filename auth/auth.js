let jwt = require('jsonwebtoken');
let express = require('express');
let bcrypt = require('bcrypt')
let { students } = require('../routes/users');
const { json } = require('express');
let checktoken = require('../middleware/authorize')
let app = express.Router();

let secret = "abc"
let generate_token = (student) => {
    let token = jwt.sign(student, secret, {
        expiresIn: 172800000
    })
    return token;
}


//signup
app.post('/signup', async(req, res) => {
    let id = students.length + 1;
    let { name, email, password } = req.body;
    if (!name)
        return res.json({ error: "enter the name" });
    if (!email)
        return res.json({ error: "enter the email" });
    if (!password)
        return res.json({ error: "enter the password" })

    else {

        for (let i = 0; i < students.length; i++) {
            if (email == students[i].email) {
                return res.json({ "error": "email id already exist" })

            }
        }
        password = password.toString();
        let hash = await bcrypt.hash(password, 10);

        // console.log(hash)
        students.push({ id, name, email, password: hash });
        return res.json({
            "data": {
                "token": generate_token({ studentId: id, email, password })
            },
            "error": "Null"
        })
    }
})

//login
app.post('/login', async(req, res) => {
    let student;
    let { email, password } = req.body;
    if (!email)
        return res.json({ error: "enter the email" });
    if (!password)
        return res.json({ error: "enter the password" });

    for (let i = 0; i < students.length; i++) {
        if (email == students[i].email) {
            student = students[i];
        }
    }
    if (student) {
        password = password.toString();
        let isValid = await bcrypt.compare(password, student.password)
        if (isValid) {
            return res.json({
                "data": {
                    "token": generate_token({ studentId: student.id, email: student.email, password: student.password })
                },
                "error": "Null"
            })
        } else return res.json({ "error": "invalid credentials" })
    }
    //
    else {
        return res.json({ "error": "invalid credentials" })
    }


})


module.exports = app;