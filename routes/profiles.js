const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// use passport for protected routes
const passport = require('passport')
const profileInputValidation = require('../validators/profile')

//load profile model
const Profile = require('../models/Profile')
//load user model
const User = require('../models/User');
const { json } = require('body-parser');
const profile = require('../validators/profile');

// public route, test route
router.get('/test', (req, res, next) => {
    res.json({message:'it works for profiles'});
})

//private route, to creaate private route use passport to get the profile of the current user 
//use thhe jwt token instead or user.id
router.get('/', passport.authenticate('jwt', { session: false}), (req,res) =>{
    //this initialize error if profile not found for it to send errors 
    const errors = {};
    //get current user profile 
    Profile.findOne({user: req.user.id})
    //to get the name from user into the profile
     .populate('user', name)
     .then(profile =>{
         //if not profile
        if(!profile){
            errors.noprofile = 'no profile for user'
            return res.status(404).json(errors)
        }
        //if it's the user profile 
        res.json(profile)
    })
     .catch(err => res.status(404).json(err));
})

// route to create and update the user because when you sign up you sign up with user 
//but you do not yet have a profile 

router.post('/', passport.authenticate('jwt', { session: false }), (req,res,next) =>{

    const { erros, isValid } = profileInputValidation(req.body)

    //check validation 
    if(!isValid){
        return res.status(400).json(errors)
    }
    //create an array to collect profile fields from the profile form in order to create or update profile
    const fields4Profile = {};
    //since the user value id not in the form becasue it was created for registration
    //i have to include it sepratly 
    fields4Profile.user = req.user.id;
    if(req.body.handle) fields4Profile.handle = req.body.handle;
    if(req.body.bio) fields4Profile.handle = req.body.handle;
    if(req.body.skills !== 'undefined') {
        //use the .split method on string to get the comma seperated value from user 
        //and put it into an array
        fields4Profile.skills = req.body.skills.split(',');
    } 
    if(req.body.website !== 'undefined') {
        fields4Profile.website = req.body.website;
    }
    // repeat the same for 
    if(req.body.social !== 'undefined') {
        //use the .split method on string to get the comma seperated value from user 
        //and put it into an array
        fields4Profile.social = req.body.social.split(',');
    }    
    if(req.body.location) fields4Profile.website = req.body.website;

    //find a profile and it there's one update it, if there's none ccreate it 
    Profile.findOne({user: req.user.id}).then(profile =>{
            if(profile){
                //update profile
                Profile.findOneAndUpdate( {user: req.body.id} ,{$set: fields4Profile},  {new: true})
                    .then(proflei => res.json({profile}))
            }else {
                //if you creating a new profile the handle is unique so we check if the handle taken already exist
                Profile.findOne({handle: req.body.handle})
                 .then(profile =>{
                    if(profile){
                        errors.handle = "this handle is already taken"
                        res.status(400).json(errors)
                    }
                    //since the handle hasnt been fownd then creattre new profile and pass the field
                    new Profile(fields4Profile).save().then(profile => res,json(profile))
                })
            }
    })
})
//public route to get all profile
router.get('all/', (req, res) =>{
    const errors = [];

    Profile.find().populate('user', 'name').then(profiles =>{
        if(!profiles){
            errors.noprofile = 'no profiles found';
            res.status(404).json(errors)
        }
        res.json(profiles)    
    })
    .catch(err => res.status(404).json({ profiles: 'there is sno profile for this user'}))
})

//a public route to get a user using their handle
router.get('handle/:handle', (req, res) =>{
    const errors = [];

    Profile.findOne({ handle: req.params.handle }).populate('user', ['name']).then( profile =>{
        if(!profile){
            errors.noprofile = 'no profile found';
            res.status(404).json(errors)
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'there is sno profile for this user'}))
})

//public route to get user using user_id mostly used by admin

router.get('user/user_id', (req, res) =>{
    const errors = []
    Profile.findOne({ user: req.params.user_id}).populate('user', name).then(
        profile => {
            if(!profile){
                errors.noprofile = 'no profile found';
                res.status(404).json(errors)
            }
            res.json(profile);
        }
    ).catch(err => res.status(404).json({ profile: 'there is sno profile for this user'}))
})
module.exports = router;