# movie-api-app

Description
  - An API able to receive infomration on movies, directors, and genres so that anyone can learn more about movies. It allows users to create profiles to save data about their favorite movies.

Objective 
  - To build the server-side component of a “movies” web application. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

My Role
  - Created a server with Express.
  - Designed a REST API with CRUD functionality.
  - Generated API documentation.
  - Conducted testing with Postman.
  - Established a NoSQL database using MongoDB.
  - Integrated the database with the API, implementing business logic.
  - Ensured sectuity with CORS middleware, permitting access from specific domains.
  - Enhanced data security by encrypting user passwords using bcrypt.
  - Implemented server-side validation and data escaping to prevent XSS and SQL injection.
  - Successfully deployed the API to an online hosting server.
  - Migrated the local database to a cloud-based hosting platform.

Prerequisites
  - Install Node.js
  - Install mongoDB
  - Use npm install--to install various dependencies
      - List of dependencies can be found in package.json file.

Technologies Used
  - Node.js
  - Express
  - Mongoose (mongoDB) - Database
  - Postman
  - Further npm packages can be found in package.json for additional details.

Middlewares
  - Body-parser: used for parsing incoming request bodies, essential for handling request with JSON or URL-encoded data.
  - Cors: Enabling Cross-Origin Resource Sharing, allowing controlled access to resources on allowed domains.
  - Morgan: Logging HTTP requests, which is used for monitoring.

Libraries
  - Bcrypt: for hashing passwords, enhancing security to user's password data.
  - JSONWebToken: creates and verifies JSON web tokens, used for authentication and authorization.
  - Mongoose: for MongoDB object modeling in Node.js.
  - Passport.js: implement user authentication and authorization strategies. 

App Details
  - [Check app here] https://my-movies-flix-007-49f90683c638.herokuapp.com/
  
