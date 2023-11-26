const { use } = require('passport');
const User = require('../models/user')
const catchAsync = require('../resources/catchAsync')
const express = require('express');
const passport = require('passport');
const router = express.Router();
// const passport = require('passport');


router.get('/register',(req, res)=>{
    res.render('user/register')
})

router.post('/register',catchAsync(async (req, res)=>{
    try{
        const {email,username,password} = req.body;
    const user = new User({email,username});
    const registerUser = await User.register(user,password);
    console.log(registerUser)
    req.flash('success','welcome new user')
    res.redirect('/campground')
    }catch(err){
        // console.log(err.message)
        const {message} = err
        // console.log(message)
        req.flash('error', message);
        res.redirect('/register')

    }
}))

router.get('/login',(req, res)=>{
    res.render('user/login')
});
router.post('/login',passport.authenticate('local', { failureFlash: true ,failureMessage : 'Incorect username or password ',failureRedirect : '/login'}),(req, res)=>{
    req.flash('success',"welcom back sir")
    res.redirect('/campground')
});
module.exports = router