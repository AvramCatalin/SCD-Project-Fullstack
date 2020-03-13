//importam modulele instalate cu npm
const logger = require('./helpers/consoleLogger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const session = require('express-session');

//importam fisierele de 'routes'
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const locationRoutes = require('./routes/locations');

//setam constantele pentru aplicatie
const app = express();
const url = 'mongodb://localhost:27017';
const port = process.env.PORT || 3000;

logger('cyan', `App env: ${app.get('env')}`);

if (!config.get('jwtPrivateKey')) {
    logger('red', 'FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
}

if (!config.get('sessionKey')) {
    logger('red', 'FATAL ERROR: sessionKey is not defined!');
    process.exit(1);
}

if (!config.get('googleMapsKey')) {
    logger('red', 'ERROR: googleMapsKey is not defined!');
}

//setam express sa foloseasca json
app.use(express.json());

//securizam aplicatia cu helmet
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    //setam log-ul sa fie de tip 'tiny'
    app.use(morgan('tiny'));
}

//setam optiunea pentru a putea accesa fisiere js si css din interiorul celor ejs 
app.use('/', express.static(__dirname + '/public'));

//setez sesiunile (o sa am nevoie pt login)
app.use(session({
    name: 'sid',
    //Aici setam un secret pentru a cripta (to encode) sesiunea
    secret: config.get('sessionKey'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        samesite: true,
        secure: false
        //Nu avem implementat HTTPS deci secure = false
    },
}));

//setam aplicatia sa fol. rutele declarate mai sus
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/users/:userEmail/locations', locationRoutes);

//setam view engine la tipul de fisiere folosite de mine (embedded java script)
app.set('view engine', 'ejs');

//conectam aplicatia la baza de date
mongoose.connect(`${url}/tracking_app`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger('green', 'Connected to MongoDB!'))
    .catch((error) => logger('red', error));

//in caz ca primeste o ruta nedeclarata sa faca redirect la login
app.get('*', (req, res) => {
    res.redirect('/login');
});

//ascultam pe portul declarat mai sus
app.listen(port, () => {
    logger('yellow', `Listening on port ${port}`);
});