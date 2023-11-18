const express = require('express');
const { model } = require('mongoose');
const { route } = require('./campground');

const router = express.Router({mergeParams:true});
const {reviewSchema}  = require('../schemas.js')

const Review = require('../models/review')
const catchAsync = require('../resources/catchAsync')
const ExpressError = require('../resources/expressError')
const Campground = require('../models/campground')




const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body)
    if (error){
        const message = error.details.map(el =>el.message).join(',')
        throw new ExpressError(message,400)
    }else{
        next();
    }
}



router.post('/', validateReview ,catchAsync( async (req, res)=>{
    // const {id} = req.params;
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    //  res.send('dnbsn')
    res.redirect(`/campground/${campground._id}`);
}))
router.delete('/:reviewid',catchAsync(async (req,res,next)=>{
    const {id,reviewid} = req.params;
      await Campground.findByIdAndUpdate(id , { $pull : { reviews : reviewid } } );
    const rev = await Review.findByIdAndDelete(req.params.reviewid);
    // const campground = await Campground.findByIdAndUpdate(req.params.id);
    res.redirect(`/campground/${id}`)
    // res.send(`${rev,campground}`)
}))



module.exports = router