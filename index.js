const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const fs = require('fs'); //import built in node modules fs and path
const path = require('path');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://127.0.0.1/myflixDB', {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb+srv://MyMoviesDBAdmin:TEARgolfteam23@mymoviesdb.qtzsjjj.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect( process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});


const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

//set up logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.get('/movies', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Movies.find({})
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Movies.findOne({'Genre.Name': req.params.genreName})
        .then((movie) => {
                res.status(200).json(movie.Genre);
            })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName})
        .then((movie) => {
                res.json(movie.Director);
            })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.post('/users', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if(user) {
            return res.status(400).send(req.body.Username + ' already exists ');
        }else{
            Users.create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }).then((user) => {
                res.status(201).json(user)
            }).catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/users/:Username', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    console.log(JSON.stringify(req.body));

    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate({ Username: req.params.Username },
        { $set:
            {
                Username: req.body.Username,
                Passowrd: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        { new: true })
        .then((updatedUser) => {
                res.json(updatedUser);
            })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Users.findOneAndUpdate(
        { Username: req.params.Username},
        { $push: { FavoriteMovies: req.params.MovieID } },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found ');
        }else {
            res.status(200).send(req.params.Username + ' was deleted ');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


//set up error handling
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('something broke');
});

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() =>{
    console.log('Listening on Port ' + port);
});