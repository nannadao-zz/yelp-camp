var  express        = require("express"),
     app            = express(),
     bodyParser     = require("body-parser"),
     mongoose       = require('mongoose'),
     flash          = require('connect-flash'),
     passport       = require("passport"),
     LocalStrategy  = require("passport-local"),
     methodOverride = require("method-override"),
     Campground     = require("./models/campground"),
     Comment        = require("./models/comment"),
     User           = require("./models/user"),
     seedDB         = require("./seeds");
/* seedDB(); */

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/authentication");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v4"
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())

//PASSPORT CONFI
app.use(require("express-session")({
    secret: "Fluffy Rhino",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(authRoutes)

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`))