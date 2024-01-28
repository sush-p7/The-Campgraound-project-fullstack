// const isLogedin = (req,res,next)=> {if(!req.isAuthenticated()){
//     req.flash('error','You must be logged in')
//     return res.redirect('/login');
// }
// next()}

module.exports.isLogedIn = (req,res,next)=> {
    // console.log("REQ:USER ",req.user)
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl)
    req.session.returnTo = req.originalUrl;
    // console.log(req.session.returnTo)                            
    req.flash('error','You must be logged in')
    return res.redirect('/login');
}
next()
}

module.exports.storeReturnTo = (req,res,next)=> {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}