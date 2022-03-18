const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ejsMate = require('ejs-mate');
const helmet = require('helmet');



/*----- Setting up mongoDB database --------------------------------------------------------------------------------- */

const mongoose = require('mongoose');
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL;
// Connecting to mongoDB
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {console.log('MongoDB connected.')})
.catch(err => {console.log(err)});



/*----- Express MiddleWares -----------------------------------------------------------------------------------------*/ 

//Initializing express
const app = express();

//Configuration variables
const secret = process.env.SECRET;

const sessionConfig = {
    name: 'app',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        // secure : true, // For production phase, turn off in developing phase.
        maxAge : 86400000 // One day in milliseconds
    },
    store : MongoStore.create({
        mongoUrl : dbUrl,
        secret,
        touchAfter : 86400 // One day in seconds
    })
}

// Setting up views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Express middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join( __dirname, '/public')));

// Adding other middlewares packages
// app.use(helmet());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session(sessionConfig));



/* ----- Setting up Passport for authentication ----------------------------------------------------------------------- */

// importing user model
const User = require('./models/user');

// User passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Adding authenticated users to locals variable
app.use((req, res, next) => { res.locals.USER = req.user; next(); });



/*----- ROUTES ---------------------------------------------------------------------------------------------------------*/

const userRoutes = require('./routes/userRoute');
const coordinatorRoutes = require('./routes/coordinatorRoute')
const authRoutes = require('./routes/authRoute');
const devRoutes = require('./routes/devRoute');
const apiRoutes = require('./routes/apiRoute');
const adminRoutes = require('./routes/adminRoute');

// API routes
app.use('/api', apiRoutes);

// User routes
app.use('/user', userRoutes);

// Coordinator routes
app.use('/coordinator', coordinatorRoutes);

// Auth routes
app.use('/auth', authRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// Dev routes - Admin needs to be logged in to access these routes
app.use('/dev', devRoutes);

// Other routes
app.get('/', (req,res) => {
    res.render('home');
});



/*----- Other Declarations -------------------------------------------------------------------------------------*/

// 404 Error
app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
})

// Error Logger
app.use((err, req, res, next) => {
    let { status = 500, msg = 'Something went wrong', message} = err;
    res.status(status).send({msg , message, stack: err.stack});
    next();
})

// Listening port declaration
const port = process.env.PORT || 3000;
app.listen( port, () => {
    console.log('SERVER STARTED ON PORT ' + port);
})
