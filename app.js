const express = require("express");
const morgan = require("morgan");
const mongoose = require('mongoose')
const gamesRoutes = require("./routes/gamesRoutes");
const override = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
const flash = require('connect-flash');



const app = express();
let port = 3000;
let host = "localhost";
let url = "mongodb+srv://ehuntle3:q9ouPUQfs2E1Ncth@cluster0.yfhnhyr.mongodb.net/nbad-project5?retryWrites=true&w=majority&appName=Cluster0";
app.set("view engine", "ejs");


//connect to MongoDB
mongoose.connect(url)
.then(() =>{
    app.listen(port, host, ()=>{
    console.log("Server is running on port", port);
})})
.catch(err => console.log(err.message));



app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(override('_method'));

app.use(
    session({
        secret: "#$3rgoi4oin*(#Y(&*y39845",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: "mongodb+srv://ehuntle3:q9ouPUQfs2E1Ncth@cluster0.yfhnhyr.mongodb.net/nbad-project5?retryWrites=true&w=majority&appName=Cluster0"}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.errors = req.flash('error');
    res.locals.successes = req.flash('success');
    res.locals.currUser = req.session.user || null;
    next();
});

app.get('/', (req, res)=>{
    res.render('index');
})




app.use('/games', gamesRoutes);
app.use('/users', userRoutes);

app.use((req, res, next)=>{
    let myError = new Error("The server is unable to find the url: " + req.url);
    myError.status = 404;
    next(myError);
})



app.use((error, req, res, next) =>{
    if(!(error.status)){
        console.log(error.message);
        error.status = 500;
        error.message = "Internal Server Error. Something went wrong";

    }

    res.status(error.status);
    res.render('error', {error});
})






