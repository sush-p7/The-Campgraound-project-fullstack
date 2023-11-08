const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const path = require('path')
const Campground = require('./models/campground')
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
app.get('/campground',async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campground/index',{campgrounds});
});
app.get('/campground/new',(req,res)=>{
    res.render('campground/new');
});
app.get('/campground/:id', async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    // const {}
    // console.log({campground})
    res.render('campground/show',{campground});
});
app.post('/campground', async (req,res)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    // const {title,location} = req.body;
    // console.log({title,location});
    res.redirect(`/campground/${campground._id}`);

});
app.get('/campground/:id/edit',async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campground/edit',{campground});
})
app.patch('/campground/:id',async (req,res)=>{
    // console.log('Campground edited successfully');
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campground/${campground._id}`)
    // await campground.save()
    // res.send({campground})
});
app.delete(`/campground/:id`,async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground');
})

app.listen(3000,()=>{
    console.log('listening on port 3000 ')
});