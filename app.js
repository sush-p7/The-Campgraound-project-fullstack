const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const sessions = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const ExpressError = require('./resources/expressError')
const campGroundR = require('./routes/campground') 
const reviewR = require('./routes/reviews') 



const app = express()
mongoose.connect('mongodb://127.0.0.1:27017/camp').then(()=>{
    console.log('Connection established');
}).catch(err => console.log('Error connecting,error:',err));

const config = {
    secret : 'sush.studio',
    resave: false,
    saveUninitialized: true,
}

app.use(sessions(config))

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({ extended:true}))
app.use(methodOverride('_method'))
app.get('/',(req,res)=>{
    // res.send('Hello')
    res.render('home')
})
app.use(express.static(path.join(__dirname,'public')));
app.use('/campground',campGroundR)
app.use('/campground/:id/reviews', reviewR );




app.all('*',(req, res, next) =>{
    // res.send("404 !!!")
    next(new ExpressError('Oh boy ... Page not found', 404));
})
app.use((error , req, res, next)=>{
    const {statuscode=500, message='Somthing went wrong '} = error;
    if(!error.message) err.message = 'Something went wrong';
    res.status(statuscode).render('error',{error});
    // res.send('Something went wrong');
});

app.listen(3000,()=>{
    console.log('listening on port 3000 ')
});