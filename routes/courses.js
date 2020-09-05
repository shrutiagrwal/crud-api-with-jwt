let express = require('express');
let app = express.Router();
let { students } = require('./users');
let checktoken = require('../middleware/authorize')
const courses = [{
        "id": 1,
        "name": "maths",
        "description": "this is a maths course",
        "enrolledstudents": [],
        "availableslots": 10
    },
    {
        "id": 2,
        "name": "english",
        "description": "this is a english course",
        "enrolledstudents": [],
        "availableslots": 10
    },
    {
        "id": 3,
        "name": "spanish",
        "description": "this is a spanish course",
        "enrolledstudents": [],
        "availableslots": 10
    }
]

//get all courses
app.get('/', (req, res) => {
        res.json({
            data: courses,
            error: null
        })
    })
    // get a course
app.get('/:id', (req, res) => {
        let id = req.params.id;
        for (let i = 0; i < courses.length; i++) {
            if (courses[i].id == id) {
                res.send(courses[i]);
                break;
            }

        }
    })
    // create a new course
app.post('/', checktoken, (req, res) => {
    let name = req.body.name;

    let description = req.body.description;
    let availableslots = req.body.availableslots;
    let id = courses.length + 1;
    if (!name) {
        return res.json({ error: "some details are missing" })
    } else {
        courses.push({ id, name, description, availableslots });
        res.json({ success: true })
            // console.log(courses)
    }
})


//enroll a student if slots are available
app.post('/:id/enroll', checktoken, (req, res) => {
    let id = req.params.id;
    let course;
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].id == id) {
            course = courses[i];
            break;
        }
    }
    if (!course)
        return res.json({ error: "this course is currently not present" })
    if (course.availableslots == 0) {
        return res.json({ error: "no slots available" })
    } else {
        let student_id = req.body.studentId;
        console.log(students.length)
        let student;
        for (let i = 0; i < students.length; i++) {
            if (student_id == students[i].id) {
                student = students[i];
                break;
            }
        }
        if (!student)
            return res.json({ error: "student id doesn't exist" });
        course.enrolledstudents.push(student);
        course.availableslots--;
        return res.json({ success: true })
    }
})


// Remove a student from course

app.put('/:id/deregister', checktoken, (req, res) => {

    let id = req.params.id;
    let course;
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].id == id) {
            course = courses[i];
            break;
        }
    }

    if (!course)
        return res.json({ error: "this course is currently not present" });
    let student_id = req.body.studentId;
    console.log(student_id)
    if (!student_id)
        return res.json({ "data": "NULL", "error": "you are not logged in" });


    let student;
    for (let i = 0; i < students.length; i++) {
        if (student_id == students[i].id) {
            student = students[i];
            break;
        }
    }
    if (!student)
        return res.json({ error: "student id doesn't exist" });
    let find = 0;
    for (let i = 0; i < course.enrolledstudents.length; i++) {
        if (student_id == course.enrolledstudents[i].id) {
            find = 1;
        }
    }
    if (find == 0)
        return res.json({ error: "no student with this id is enrolled" });
    let newlist = course.enrolledstudents.filter(student => student.id !== student_id);
    course.enrolledstudents = newlist;
    return res.json({ success: true })
})
module.exports = app;