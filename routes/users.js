let express = require('express');
let bcrypt = require('bcrypt');
let app = express.Router();
let students = [{
        "id": 1,
        "name": "Batman",
        "email": "batman@gmail.com",
        "password": 1232
    },
    {
        "id": 2,
        "name": "Joker",
        "email": "joker@gmail.com",
        "password": 1234
    },
    {
        "id": 3,
        "name": "Shepherd",
        "email": "shepherd@gmail.com",
        "password": 12321
    }
]

//get all students
app.get('/', (req, res) => {
    res.json({ data: students, error: null })
});

module.exports = { app, students };