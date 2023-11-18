const express = require('express');
const router = express.Router();
const {campgroundSchema}  = require('../schemas.js')
const catchAsync = require('../resources/catchAsync')
const ExpressError = require('../resources/expressError')
const Campground = require('../models/campground')

const validateCampground = (req, res, next) =>{
    
    const {error} = campgroundSchema.validate(req.body)
    if (error){
        const message = error.details.map(el =>el.message).join(',')
        throw new ExpressError(message,400)
    }else{
    next();}
}

router.get('/', catchAsync( async (req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds});
}));
router.get('/new',(req,res,next)=>{
    res.render('campground/new');
});
router.get('/:id',  catchAsync( async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews')
    // console.log(campground)
    // const {}
    // console.log({campground})
    res.render('campground/show',{campground});
}));
router.post('/' ,validateCampground, catchAsync( async (req,res,next)=>{
    // if (!req.body.campground) throw new ExpressError('invalid campground data',400);
    
    const campground = new Campground(req.body.campground)
    await campground.save()
    // const {title,location} = req.body;
    // console.log({title,location});
    res.redirect(`/campground/${campground._id}`)
    

}));
router.get('/:id/edit', catchAsync( async (req,res,next)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campground/edit',{campground});
}))
router.patch('/:id',validateCampground, catchAsync( async (req,res)=>{
    // console.log('Campground edited successfully');
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campground/${campground._id}`)
    // await campground.save()
    // res.send({campground})
}));

router.delete('/:id', catchAsync( async (req, res,next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground');
}));

module.exports = router