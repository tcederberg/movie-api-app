const express = require('express'),
    morgan = require('morgan'),
fs = require('fs'), // import built in node modules fs and path
path = require('path');
const app = express();

let topMovies = [
    {
        title: 'Napoleon Dynamite',
        director: 'Jared Hess',
        year: '2004'
    },
    {
        title: 'Harry Potter and the Prisoner of Azkaban',
        director: 'Alfonso Cuaron',
        year: '2004'
    },
    {
        title: 'Saving Private Ryan',
        director: 'Steven Spielberg',
        year: '1998'
    },
    {
        title: 'Inception',
        director: 'Christopher Nolan',
        year: '2010'
    },
    {
        title: 'Captain America: Civil War',
        director: ['Anthony Russo, Joe Russo'],
        year: '2016'
    },
    {
        title: 'Up',
        director: ['Pete Docter', 'Bob Peterson'],
        year: '2009'
    },
    {
        title: 'Avengers: Infinity War',
        director: ['Anthony Russo', 'Joe Russo'],
        year: '2018'
    },
    {
        title: 'Harry Potter and the Half-Blood Prince',
        director: 'David Yates',
        year: '2009'
    },
    {
        title: 'The Mummy',
        director: 'Stephen Sommers',
        year: '1999'
    },
    {
        title: 'The Departed',
        director: 'Martin Scorsese',
        year: '2006'
    },

];
// setup logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));
// setup app routing
app.use(express.static('public'));
// GET request
    app.get('/', (req, res)=>{
        res.send('Welcome to myFlix application!');
    });
    app.get('/documentation.html', (req, res)=>{
        res.sendFile('public/documentation.html', {root: __dirname});
    });
    app.get('/movies', (req, res)=>{
        res.json(topMovies);
    });

// setup error handling
app.use((err, req, res, next)=>{
    console.error(err.stack);
});
//listen for requests
app.listen(8080,()=>{
    console.log("My server is running on port 8080.");
});