if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing")
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const dbURl = process.env.ATLASDB_URL;
mongoose.connect(dbURl)
.then(() => console.log("Connected to MongoDB"));


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const store = mongoStore.create({
    mongoUrl: dbURl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60,
})
store.on("error",(err)=>{
    console.log("Erroe in mongo sestion store",err)
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
    }
}


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next(); 
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {status=500, message="something went wrong"} = err; 
    res.status(status).render("error.ejs",{err});
});

app.get("/",(req,res)=>{
    res.send("hello world");
})


app.listen(8080,()=>{
    console.log("server running")
});