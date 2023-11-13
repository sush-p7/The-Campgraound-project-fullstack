const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const {campgroundSchema}  = require('./schemas.js')
const Joi = require('joi')
const catchAsync = require('./resources/catchAsync')
const methodOverride = require('method-override')
const path = require('path')
const Campground = require('./models/campground')
const ExpressError = require('./resources/expressError')
const { error } = require('console')
const app = express()
// mongoose.connect('mongodb://127.0.0.1:27017/myapp');
mongoose.connect('mongodb://127.0.0.1:27017/camp').then(()=>{
    console.log('Connection established');
}).catch(err => console.log('Error connecting,error:',err));

app.engine('ejs',ejsMate)
// app.use(express.urlencoded = true)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({ extended:true}))
app.use(methodOverride('_method'))
app.get('/',(req,res)=>{
    // res.send('Hello')
    res.render('home')
})
const validateCampground = (req, res, next) =>{
    
    const {error} = campgroundSchema.validate(req.body)
    if (error){
        const message = error.details.map(el =>el.message).join(',')
        throw new ExpressError(message,400)
    }else{
    next();}
}

app.get('/campground', catchAsync( async (req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds});
}));
app.get('/campground/new',(req,res,next)=>{
    res.render('campground/new');
});
app.get('/campground/:id',  catchAsync( async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id)
    // const {}
    // console.log({campground})
    res.render('campground/show',{campground});
}));
app.post('/campground' ,validateCampground, catchAsync( async (req,res,next)=>{
    // if (!req.body.campground) throw new ExpressError('invalid campground data',400);
    
    const campground = new Campground(req.body.campground)
    await campground.save()
    // const {title,location} = req.body;
    // console.log({title,location});
    res.redirect(`/campground/${campground._id}`)
    

}));
app.get('/campground/:id/edit', catchAsync( async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campground/edit',{campground});
}))
app.patch('/campground/:id',validateCampground, catchAsync( async (req,res)=>{
    // console.log('Campground edited successfully');
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campground/${campground._id}`)
    // await campground.save()
    // res.send({campground})
}));
app.delete('/campground/:id', catchAsync( async (req, res,next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground');
}));

app.all('*',(req, res, next) =>{
    // res.send("404 !!!")
    next(new ExpressError('Oh boy ... Page not found', 404));
})
app.use((error , req, res, next)=>{
    const {statuscode=500,message='Somthing went wrong '} = error;
    if(!error.message) err.message = 'Something went wrong';
    res.status(statuscode).render('error',{error});
    // res.send('Something went wrong');
});

app.listen(3000,()=>{
    console.log('listening on port 3000 ')
});