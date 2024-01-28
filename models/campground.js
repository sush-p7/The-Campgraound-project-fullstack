const mongoose = require('mongoose');
// const review = require('./review');
const Review = require('./review');
const Schema = mongoose.Schema;
const campGround = new Schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    auther : {
        type : Schema.Types.ObjectId,
        ref : 'User', 
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review',
        }
    ]
})

campGround.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.deleteMany({
            _id : {
                $in : doc.reviews,
            }
        })
        
    }
    // console.log(doc);
})

module.exports = mongoose.model('campGround',campGround)