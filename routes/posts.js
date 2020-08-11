const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')
const postInputValidation = require('../validators/post')
const validateReplyInpuut = require('../validators/comments');

//load Post model
const Post = require('../models/Post');
const Profile = require('../models/Profile');

//a route to get all post or one post, it's a public route
router.get('/', (req, res) =>{
    Post.find().sort({date: -1}).then(posts  => res.json(posts)).catch(err =>res.status(404).json({message:'posts not found'}))
})

//route to get the post of a single user
router.get('/:id', (req, res) =>{
    Post.find().sort({date: -1}).then(posts  => res.json(posts)).catch(err =>res.status(404).json({message:'post not found'}))
})

//create a post request in oeder to send a post like a tweet

router.post('/', passport.authenticate('jwt', { session: false}),(req, res) => {
    const { erros, isValid } = postInputValidation(req.body)

    //check validation 
    if(!isValid){
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        text = req.body.text,
        name = req.user.name,
        user = req.user.id
    })

    newPost.save().then(post =>res.json(post))
})

//delete a your post it's a private route
router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res) =>{
    Profile.findOne({ user: req.body.id}).then(profile =>{
        Post.findById(req.params.id).then(post => {
            if(post.user.toString() !== req.user.id) {
                
                return res.status(401).json({ notauth: 'user not authorized'})
            }

            //since it the user it can delete
            post.remove().then(()=> res.json({ success: true}))
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found'}))
    })
})
// update a post it's a private route
router.put('/:id', passport.authenticate('jwt', { session: false}), (req, res) =>{
    rofile.findOne({ user: req.body.id}).then(profile =>{
        Post.findById(req.params.id).then(post => {
            if(post.user.toString() !== req.user.id) {
                return res.status(401).json({ notauth: 'user not authorized'})
            }
            //
            const newPost = new Post({
                text = req.body.text,
                name = req.user.name,
                user = req.user.id
            })

            newPost.save().then(post =>res.json(post))
        })
        .catch(err => res.status(404).json({action: "action can't be done"}))
    })       
})

// routes for like on a post 

router.post('like/:id', passport.authenticate('jwt', { session: false}), (req, res) =>{
    rofile.findOne({ user: req.body.id}).then(profile =>{
        Post.findById(req.params.id).then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(401).json({ msg: 'user already liked th epost'})
            }
            // 
            post.likes.unshift({ user: req.user.id})
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({action: "action can't be done"}))
    })       
})
// route for unliike 

router.post('like/:id', passport.authenticate('jwt', { session: false}), (req, res) =>{
    rofile.findOne({ user: req.body.id}).then(profile =>{
        Post.findById(req.params.id).then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(401).json({ msg: 'user already liked th epost'})
            }
            // find the indx of the user who liked the post 
            const removeIndex  = post.likes.map(item => item.user.toString()).indexOf(req.user.id)
            // romvem the user from the like array therefore removing th elike
            post.likes.splice(removeIndex, 1)
            //save the post
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({action: "action can't be done"}))
    })       
})

// comments routes
//create comment
router.post('/reply/:id', passport.authenticate('jwt', { session: false}), (req, res) =>{
    const { erros, isValid } = validateReplyInpuut(req.body)

    //check validation 
    if(!isValid){
        errors.text = 'post not found'
        return res.status(400).json(errors)
    }
    Post.findById(req.params.id).then(post =>{
        const newReply = {
            text: req.body.text,
            name: req.body.name,
            user: req.user.id
        }

        //add it to the array of comment on this specific post
        post.reply.unshift(newReply)

        //save
        post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json({ msg: 'post not found'}))
})

//delete comment
router.delete('/reply/:id', passport.authenticate('jwt', { session: false}), (req, res) =>{
    Post.findById(req.params.id).then(post =>{
        if(post.reply.filter( reply => reply._id.toString() === req.params.reply_id).length === 0){
            return res.status(404).json({ msg: 'reply not found'})
        }
        post.reply.splice(removeIndex, 1)

        post.save().then(post = res.json(post))
    })
    .catch(err => res.status(404).json({ msg: 'post not found'}))
})


module.exports = router;