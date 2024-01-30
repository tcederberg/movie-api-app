const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport.js');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
};

/**
 * @description Login user
 * @example
 * Authentication: None
 * @name POST /login
 * @example
 * Request data format
 * {
 *  "Username": "",
 *  "Password": ""
 * }
 * @example
 * Response data format
 * {
 *   user: {
 *     "_id": ObjectID,
 *     "Username": "",
 *     "Password": "",
 *     "Email": "",
 *     "DOB": "",
 *     "FavoriteMovies": [ObjectID]
 *   },
 *   token: ""
 * }
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Username or Password is incorrect',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
};