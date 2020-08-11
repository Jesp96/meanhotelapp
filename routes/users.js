const express = require('express');
const passport = require('passport');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
const router = express.Router();
const registerInputValidation = require('../validators/register')
const LoginInputValidation = require('../validators/login')

//sendgrid api key

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

// load user

const User = require('../models/User');
const { token } = require('morgan');


// user registration route

router.post('/register', (req, res) => {
    const { errors, isValid } = registerInputValidation(req.body);

    //check validation 
    if(!isValid){
        return res.status(400).json(errors)
    }
    // check for repeate user by email
    const { name, email, password } = req.body
    User.findOne({ email: req.body.email})
    .then(user => {
        if(user) {
            errors.email = 'email already exit'
            return res.status(400).json(errors);
        } 
    })
    // create token for jwt 
    const token = jwt.sign({name, email, password}, process.env.JWT_ACOOUNT_ACTIVATOR, {expiresIn: '30m'})
    // create email template verification
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: 'Confirm Your Account',
        html: `
            <h1>Please use the following link to activate your account</h1>
            <p>${process.env.Client_URL}/routes/users/${token}</p>  `
    }
    //send email 
    sgMail.send(emailData).then(sent => {
        console.log('email sent for activation')
        return res.json({
            message: 'Email has been sent to acctivate your account'
        })
    })
})

router.post('/account-activation', (req, res) =>{
    const { token } = req.body;
    // this for email account verfication


    // this code verifies the token to see if it match or expire
    if (token) {
        jwt.verify(token, process.env.JWT_ACOOUNT_ACTIVATOR, function(err, decoded) {
            // if it is expire it will send an error
            if(err){
                console.log('tokken err', err)
                res.status(404).json({
                    message:'expired link '
                })
            }
            // since no err jwt will decoe the toke to get the user info
            const { name, email, password } = jwt.decode(token)
             // add user to User model
            const user = new User({ name, email, password})
            //save user to db
            user.save((err, user) => {
                if(err){
                    console.log('there was an error in account activation', err)
                    res.status(404).json({
                        error: 'there was an error try registering again again'
                    })
                return res.json({
                    message: 'you have succesfully been registered'
                })    
                }
            })
        })
    }
})
// lgin route

router.post('/login',(req, res) => {
    const { errors, isValid } = LoginInputValidation (req.body);

    //check validation 
    if(!isValid){
        return res.status(400).json(errors)
    }


    const { email, password } = req.body

    // find the user by eamil
    User.findOne({email})
     .then(user => {
        if(!user){
            errors.email = 'email not found'
            return res.status(404).json(errors)
        }

        const payload = { id: user.id, name: user.name, avatar: user.avatar}
        // if email is found i use userSchema method to authenthicat the password
        // if they don't math user password
        if(!user.comparePassword(password)) {
            errors.password = 'password incorrect'
            return res.status(400).json(errors)
        }
        // this is use to validate login using an token
        jwt.sign(
            payload, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: '1d'},
            (err, token) => {
                res.json({
                    success: true,
                    token: 'Bearer' + token
                })
            }
        )
    })
})
// private route to get the current user will be a get request

router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({
        id: req.user.id,        
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router;