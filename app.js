let express = require('express');
let app = express();
let courses = require('./routes/courses');
let { app: users } = require('./routes/users');
let auth = require('./auth/auth')
    // const users = require('./routes/users')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/courses', courses);
app.use('/api/students', users);
app.use('/api/auth', auth);
app.listen(3000, (err) => {
    if (err)
        console.log(err);
    else console.log("server started successfully")
})