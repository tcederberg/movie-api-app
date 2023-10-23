const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    fs = require('fs'), //import built in node modules fs and path
    path = require('path');
const { title } = require('process');
const app = express();
app.use(bodyParser.json());

let movies = [
    {
        Title : "The Godfather",
        Description : "The patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        Genre : 
            {
                Name : "Crime",
                Description : "Movies in this genre explore criminal activities, their consequences, and the moral dilemmas faces by the characters.",
            },
        Director : 
            {
                Name : "Francis Ford Coppola",
                Bio : "Francis Ford Coppola is an American film director, producer, and screenwriter. He is best known for directing the critically acclaimed 'The Godfather trilogy' and the Vietnam War epic Apocalypse Now. Coppola has won multiple Academy Awards during his career and is considered one of the most influential filmmakers in the history of cinema.",
                DOB : "April 7, 1939",
            },
        Actor: [
            {
                Name: "Marlon Brando",
                DOB : "April 3, 1924",
            },
            {
                Name : "Al Pacino",
                DOB : "April 25, 1940",
            },
        ],
        Release_date : "1972",
        Rating : "9.2",
        imageURL : "https://www.imdb.com/title/tt0068646/mediaviewer/rm746868224/?ref_=tt_ov_i",
        Featured : false,
    },
    {
        Title : "Inception",
        Description : "A thief, who enters people's dreams to steal their secrets, is given a final job where he must implant an idea into someone's mind.",
        Genre : 
            {
                Name : "Science Fiction",
                Description : "Sci-Fi films combine futuristic or scientific concepts with intense action sequences, often set in space, the future, or with advanced technology.",
            },
        Director : 
            {
                Name : "Christopher Nolan",
                Bio : "Christopher Nolan is a British-American film director, producer, and screenwriter known for his work on films such as 'Inception', 'The Dark Knight Trilogy', 'Interstellar, and Dunkirk. Nolan is known for his innovative storytelling and contributions to the science fiction and superhero genres.",
                DOB : "July 30, 1970",
            },
        Actor : [
            {
                Name : "Leonardo DiCaprio",
                DOB : "November 11, 1974",
            },
            {
                Name : "Joseph Gordon-Levitt",
                DOB : "February 17, 1981",
            },
            {
                Name : "Ellen Page",
                DOB : "February 21, 1987",
            },
        ],
        Release_date : "2010",
        Rating : "8.8",
        imageURL : "https://www.imdb.com/title/tt1375666/mediaviewer/rm3426651392/?ref_=tt_ov_i",
        Featured : true,
    },
    {
        Title : "The Shawshank Dedemption",
        Description : "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        Genre : 
            {
                Name : "Drama",
                Description : "Drama films portray realistic and emotional stories focusing on the characters' personal development and life challenges.",
            },
        Director : 
            {
                Name : "Frank Darabont",
                Bio : "Frank Darabont is an American filmmaker, screenwriter, and director. He is renowned for his work in adapting Stephen King's stories into successful films, including 'The Shawshank Redemption' and 'The Green Mile.' Darabont is known for his skill in creating emotionally powerful and character-driven narratives.",
                DOB : "January 28, 1959",
            },
        Actor : [
            {
                Name : "Tim Robbins",
                DOB : "October 16, 1958",
            },
            {
                Name : "Morgan Freeman",
                DOB : "June 1, 1937",
            },
        ],
        Release_date : "1994",
        Rating : "9.3",
        imageURL : "https://www.imdb.com/title/tt0111161/mediaviewer/rm1690056449/?ref_=tt_ov_i",
        Featured : false,
    },
    {
        Title : "The Dark Knight",
        Description : "When the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        Genre : 
            {
                Name : "Action",
                Description : "Action movies feature characters with extraordinary abilities who engage in thrilling action sequences, typically battling supervillains to save the world.",
            },
        Director : 
            {
                Name : "Christopher Nolan",
                Bio : "Christopher Nolan is a British-American film director, producer, and screenwriter known for his work on films such as 'Inception', 'The Dark Knight Trilogy', 'Interstellar, and Dunkirk. Nolan is known for his innovative storytelling and contributions to the science fiction and superhero genres.",
                DOB : "July 30, 1970",
            },
        Actor : [
            {
                Name : "Christian Bale",
                DOB : "January 30, 1974",
            },
            {
                Name : "Heath Ledger",
                DOB : "April 4, 1979",
                Death : "January 22, 2008",
            },
        ],
        Release_date : "2008",
        Rating : "9.0",
        imageURL : "https://www.imdb.com/title/tt0468569/mediaviewer/rm4023877632/?ref_=tt_ov_i/",
        Feature : true,
    },
    {
        Title : "Forrest Gump",
        Description : "Through three decades of U.S. history, a man with a low IQ witnesses and unwittingly influences several defining historical events in the 20th century United States.",
        Genre :
            {
                Name : "Romance",
                Description : "Romance films incorporate song and dance numbers to tell romantic stories, where music and choreography play a significant role in the narrative",
            },
        Director :
            {
                Name : "Robert Zemeckis",
                Bio : "Robert Zemeckis is an American filmmaker, screenwriter, and producer. He is famous for directing and co-writing the 'Back to the Future' trilogy, 'Forrest Gump,' 'Cast Away,' and 'Who Framed Roger Rabbit.' Zemeckis is known for his innovative use of visual effects and storytelling techniques in his films.",
                DOB : "May 14, 1951",
            },
        Actor : [
            {
                Name : "Tom Hanks",
                DOB : "July 9, 1956",
            },
            {
                Name : "Robin Wright",
                DOB : "April 8, 1966",
            },
        ],
        Release_date : "1994",
        Rating : "8.8",
        imageURL : "https://www.imdb.com/title/tt0109830/mediaviewer/rm1954748672/?ref_=tt_ov_i",
        Featured : false,
    },
];

let users = [
    {
        id : 1,
        name : "Kim",
        favoriteMovies : [],
    },
    {
        id : 2,
        name : "Joe",
        favoriteMovies : ["Inception"],
    },
    {
        id : 3,
        name : "Mat",
        favoriteMovies : [],
    },
];

//set up logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

//READ
app.get('/movies', (req, res)=>{
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res)=>{
    const {title} = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if(movie){
        res.status(200).json(movie);
    }else{
        res.status(400).send('no such movie');
    }
});

app.get('/movies/genre/:genreName', (req, res)=>{
    const {genreName} = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if(genre){
        res.status(200).json(genre);
    }else{
        res.status(400).send('no such genre');
    }
});

app.get('/movies/director/:directorName', (req, res)=>{
    const {directorName} = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if(director){
        res.status(200).json(director);
    }else{
        res.status(400).send('no such director');
    }
});

//CREATE
app.post('/users', (req, res)=>{
    const newUser = req.body;
    if(newUser.name){
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(200).json(newUser);
    }else{
        res.status(400).send('user needs name');
    }
});

//UPDATE
app.put('/users/:id', (req, res)=>{
    const {id} = req.params;
    const updateUser = req.body;
    let user = users.find(user => user.id == id);

    if(user){
        user.name = updateUser.name;
        res.status(200).json(user);
    }else{
        res.status(400).send('user not found');
    }
});

//CREATE
app.post('/users/:id/:movieTitle', (req, res)=>{
    const {id, movieTitle} = req.params;
    let user = users.find(user => user.id == id);

    if(user){
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id} array.`);
    }else{
        res.status(400).send('no such user');
    }
});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res)=>{
    const {id, movieTitle} = req.params;
    let user = users.find(user => user.id == id);
    
    if(user){
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id} array.`);
    }else{
        res.status(400).send('no such user');
    }
});

app.delete('/users/:id', (req, res)=>{
    const {id} = req.params;
    let user = users.find(user => user.id == id);

    if(user){
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${id} has been deleted.`);
    }else{
        res.status(400).send('no such user');
    }
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

