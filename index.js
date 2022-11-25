const express = require('express');
//setting cookies
const cookieParser=require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport_layout_stratergy');
const { Store } = require('express-session');
const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const { debug } = require('console');

app.use(sassMiddleware({
    src: './assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'expanded',
    prefix:'/css'
}));
//extract style and scripts from sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);



// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
//mongo store is used to store the seesion cookie in the db
app.use(session({
    name: 'codeial',
    //todo cheange the secret before deployment in production mode
    secret: 'blasomething',
    saveUninitialized:false,//when the user is not looged in
    resave:false, //when the user is looged in it is not need to alter its information
    cookie:{
        //miliseconds
        maxAge:(1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        }
        ,function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
