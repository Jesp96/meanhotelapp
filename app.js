require('./data/db');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const passport = require('passport');
require('dotenv').config();

//imported routes
const userauthroutes = require('./routes/users');
const profilesroutes = require('./routes/profiles');
const postsroutes = require('./routes/posts');

//app the app
const app = express();

//passport middleware 
app.use(passport.initialize())

// passport config
require('./passconfig/passport', (passport))
//middleware routes

app.use('/api', userauthroutes);

/*
app.use('/api', profilesroutes);
app.use('/api', postsroutes);
*/
//morgan middlewware to check our routes endpoint anf http status

app.use(morgan('dev'));


//adding body parser to access form data
app.use(bodyParser.json());


//port and connection 

const port = 5000;

app.listen(port, () =>[
    console.log(`the server is running on port ${port}`)
])