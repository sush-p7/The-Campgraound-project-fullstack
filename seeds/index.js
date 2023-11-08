const mongoose = require('mongoose')
const path = require('path')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedsHelper')
mongoose.connect('mongodb://127.0.0.1:27017/camp').then(()=>{
    console.log('Connection established');
}).catch(err => console.log('Error connecting,error:',err));

const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for (let i=0; i <50; i++){
        const random100 = Math.floor(Math.random()*100);
        const price = Math.floor(Math.random()*20)+10
        const camp = new Campground({
            location: `${cities[random100].city}, ${cities[random100].state}`,
            image :`https://source.unsplash.com/collection/8581622`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description :'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem odit autem sunt voluptate suscipit illum minima beatae, voluptatem a iusto, dolorem quod est quaerat delectus saepe labore. Voluptas, sit nobis.',
            price : price,
        });
        await camp.save()

    }
};
     

seedDB().then(()=>{
    mongoose.connection.close();
})