require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOption')
const {logger} = require('./middleware/logEvents');
const errHandler = require('./middleware/errHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//Connect to mongoDB
connectDB();

//custom middleware logger
app.use(logger);

//Handle options credentials chech - before CORS!
//and fetch cookies credentiela requirements
app.use(credentials)

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded for data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts('json')){
        res.json({error: "404 not found"});
    }else {
        res.type('txt').send('404 not found');
    }
});

app.use(errHandler);

mongoose.connection.once('open', () => {
    console.log("Connected to mongoDB");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});