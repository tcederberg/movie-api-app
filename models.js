const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
//schema defines for document in movie collection
let movieSchema = mongoose.Schema(
    {
        Title: {type: String, require: true},
        Description: {type: String, require: true},
        Genre: {
            Name: String,
            Description: String
        },
        Director: {
            Name: String,
            Bio: String,
            Birth: Date,
            Death: Date
        },
        ImagePath: String,
        Featured: Boolean
    }
);

let userSchema = mongoose.Schema(
    {
        Username: {type: String, required: true},
        Password: {type: String, required: true},
        Email: {type: String, required: true},
        Birthday: Date,
        FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

//create a collection of db.movies and db.users
let Movie= mongoose.model('Movie', movieSchema);
let User= mongoose.model('User', userSchema);

//exports models to index.js
module.exports.Movie = Movie;
module.exports.User= User;