if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const express = require("express");
const app=express()
const bcrypt= require("bcrypt")
const bodyParser = require("body-parser");
const passport=require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session= require("express-session")
const methodOverride=require("method-override")
initializePassport(passport,
    email=> users.find(user => user.email === email),
id=> users.find(user=>user.id===id)
)
const users=[]
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialised: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.get("/",checkAuthenticated, (req,res)=>{
    res.render("index.ejs", {name :req.user.name})
});
app.get("/registration",checkNotAuthenticated,(req,res)=>{
    res.render("registration.ejs")
});
app.post("/registration",checkNotAuthenticated,async function(req,res){

    const hashedPassword = await bcrypt.hash(req.body.password, 16);
    users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    res.redirect("/login")
console.log(users)
});
app.get("/login", checkNotAuthenticated,(req,res)=>{
    res.render("login.ejs")
});
app.post("/login",checkNotAuthenticated,passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect("/login")
}
)
function checkAuthenticated(req,res,next)
{
if(req.isAuthenticated()){
    return next()
}res.redirect("/login")
}
function checkNotAuthenticated(req,res,next)
{if(req.isAuthenticated()){
    return res.redirect("/")}
next()
}
app.listen(process.env.PORT || 4000, function(){
    console.log("server has started on 4000 port")
});
