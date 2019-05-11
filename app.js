const express = require('express');
const jwt = require('jsonwebtoken');
const app = express()
var ls = require('local-storage');
const path = require('path');
const mongoose = require('mongoose');
app.use(express.urlencoded());
app.use(express.json());

//db con
mongoose.connect('mongodb://localhost/db0001', { useNewUrlParser: true });
const User = require('./models/User');

mongoose.Promise = Promise;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function (req, res, next) {
    res.render('index', { title: 'Hello World!' });
});

// https://davidwalsh.name/2fa

//#region auth 


app.post('/login', (req, res) => {
    if (req.body.btn == "SignIn") {
        User.findOne({ username: req.body.user.username, password: req.body.user.password })
            .then((u) => {
                if (!u) { res.render('login') }
                else {
                    jwt.sign({
                        user: u
                    }, 'secret', { expiresIn: '1h' }, (err, token) => {
                        ls.set('token', token);
                        switch (u.role) {
                            case 'admin':
                                res.render('admin')
                                break;
                            case 'user':
                                res.render('user')
                                break;
                                case 'project-manager':
                                res.render('project-manager')
                                break;
                            default:
                                res.render('hello', { user: u })

                        }
                    })
                }
            })

    } else {
        const user = new User(req.body.user)
        user.save().then(() => { console.log("registered"); })
       res.render('hello',{user})
    }

}
);

function verifyToken(req, res, next) {
    const token = ls.get('token')
    if (token) {
        req.token = token
        jwt.verify(req.token, 'secret', function (err, decoded) {
            next()
        })
    } else {
        //Forbidden
        res.sendStatus(403)
    }

};


app.get('/logout', (req, res) => {
    console.log("loggin out");
    ls.set('token', null);
     res.redirect('/');
});
//#endregion


//routes setup
const nameRouter = require('./routes/name');
const detailsRouter = require('./routes/details');

app.use('/name', verifyToken,nameRouter);
app.use('/details', verifyToken,detailsRouter);




app.listen(5000, () => {
    console.log('http://localhost:5000');
});

