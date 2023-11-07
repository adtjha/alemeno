const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');

app.use(cors());

const Fuse = require('fuse.js')

const bodyParser = require('body-parser');

app.use(bodyParser.json())

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./alemeno-ae2e6-679e86e2659f.json');

const firebaseApp = initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const courseRef = db.collection('course');
const userRef = db.collection('user');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use((req, res, next) => {
    if (req.url !== '/login') {
        let token = req.headers.authorization;
        jwt.verify(token, 'secret', function (err, decoded) {
            if (err) {
                res.sendStatus(401);
                return;
            } else {
                next()
            }
        })
    } else {
        next();
    }

})

// Create a Retrieve Course List API:
app.get('/course/lists', async (req, res) => {
    const page = Number(req.query.page);
    if (page < 1) {
        res.sendStatus(404);
    }
    const endAtPage = page * 2;
    const startAtPage = endAtPage - 1;

    const snap = await courseRef.orderBy('id', 'asc').startAt(startAtPage).endAt(endAtPage).get();
    let course = [];
    console.log(snap.docs)
    snap.forEach(doc => {
        course.push(doc.data())
    })

    res.json({
        "page": page,
        "courses": course
    });
})

//  Retrieve API for Course Details:
app.get('/course', async (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.sendStatus(500);
    }
    const snap = await courseRef.where('id', '==', Number(id)).get();
    let course;
    snap.forEach(doc => {
        course = doc.data();
    });
    console.log(course);
    res.send({ course });
})


// API for Enroll in a Course:
app.get('/course/enroll', async (req, res) => {
    const courseId = req.query.courseId;
    const userId = req.query.userId;
    if (!userId || !courseId) {
        res.sendStatus(500);
    }
    const snap = await courseRef.where('id', '==', Number(courseId)).get();
    let course, courseDoc;
    snap.forEach(doc => {
        course = doc.data();
        courseDoc = doc.id;
    });

    const resp = await courseRef.doc(courseDoc).update({
        students: FieldValue.arrayUnion(Number(userId))
    });

    res.send({ resp });
})

// Retrieve Enrolled Courses:
app.get('/course/enrolled', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        res.sendStatus(500);
    }

    const snap = await courseRef.where('students', 'array-contains', Number(userId)).get();
    let courses = [];
    snap.forEach(doc => {
        courses.push(doc.data());
    });
    res.send({ courses });
})

// Mark Courses as Completed:
app.get('/course/completed', async (req, res) => {
    const courseId = req.query.courseId;
    const userId = req.query.userId;
    if (!userId || !courseId) {
        res.sendStatus(500);
    }

    let snap1 = await courseRef.where('id', '==', Number(courseId)).get();
    let course;
    snap1.forEach(doc => {
        course = doc.data();
    });

    if (course.students.includes(Number(userId))) {
        const snap = await userRef.where('id', '==', Number(userId)).get();
        let userDoc;
        snap.forEach(doc => {
            userDoc = doc.id;
        });

        const resp = await userRef.doc(userDoc).update({
            courseCompleted: FieldValue.arrayUnion(Number(courseId))
        });

        res.send('OK');
    } else {
        res.sendStatus(404)
    }

})

app.get('/search', async (req, res) => {
    const q = req.query.q;

    const fuseOptions = {
        keys: [
            "duration",
            "prerequisites",
            "schedule",
            "syllabus",
            "instructor",
            "enrollmentStatus",
            "name",
            "description",
            "location",
            "id",
            "thumbnail",
            "students",
            "uid",
            "likes"
        ]
    };

    const snap = await courseRef.get();
    let courses = [];
    snap.forEach(doc => {
        courses.push(doc.data());
    });


    const fuse = new Fuse(courses, fuseOptions);

    let filteredCourses = fuse.search(q);

    filteredCourses = filteredCourses.map(course => course.item)

    res.send(filteredCourses)
})


// User Authentication:
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    const snap = await userRef.where('username', '==', username).get();
    let user;
    snap.forEach(doc => {
        user = doc.data();
    });
    console.log(user);
    if (hashedPassword === user.password) {
        const token = jwt.sign({
            ...user
        }, 'secret', { expiresIn: 60 * 60 * 60 });
        res.send({ token, user });
    } else {
        res.sendStatus(500);
    }
})
