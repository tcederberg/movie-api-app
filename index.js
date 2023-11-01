const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
const uuid = require('uuid');
const fs = require('fs'); //import built in node modules fs and path
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1/myflixDB', {useNewUrlParser: true, useUnifiedTopology: true});

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

app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if(user) {
            return res.status(400).send(req.body.Username + ' already exists ');
        }else{
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }).then((user) => {
                res.status(201).json(user)
            }).catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
        });
});

/*app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});*/

app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username },
        { $set:
            {
                Username: req.body.Username,
                Passowrd: req.body.Password,
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
app.listen(8080,()=>{
    console.log("my server is running on port 8080.");
});



/*const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
const uuid = require('uuid');
const fs = require('fs'); //import built in node modules fs and path
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1/myflixDB', {useNewUrlParser: true, useUnifiedTopology: true});




//set up logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));


app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/genres/:genreName', (req, res) => {
    Movies.findOne({'Genre.Name': req.params.genreName})
        .then((movie) => {
                res.status(200).json(movie.Genre);
            })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/directors/:directorName', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName})
        .then((movie) => {
                res.json(movie.Director);
            })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if(user) {
            return res.status(400).send(req.body.Username + ' already exists ');
        }else{
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }).then((user) => {
                res.status(201).json(user)
            }).catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
        });
});

app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username },
        { $set:
            {
                Username: req.body.Username,
                Passowrd: req.body.Password,
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

app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
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

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
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

app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
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

app.use(express.static('public'));

//set up error handling
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('something broke');
});

//listen for requests
app.listen(8080,()=>{
    console.log("my server is running on port 8080.");
});
*/
