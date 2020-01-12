//importam modulele instalate cu npm
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

//importam fisierele de 'routes'
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const locationRoutes = require('./routes/locations');

//setam constantele pentru aplicatie
const app = express();
const url = 'mongodb://localhost:27017';
const port = 3000;

//setam express sa foloseasca json
app.use(express.json());

//setam express sa foloseasca bodyParsers (pt formurile web)
app.use(bodyParser.urlencoded({ extended: true }));

//setam optiunea pentru a putea accesa fisiere js si css din interiorul celor ejs 
app.use('/', express.static(__dirname + '/public'));

//setez sesiunile (o sa am nevoie pt login)
app.use(session({
    name: 'sid',
    //Aici setam un secret pentru a cripta (to encode) sesiunea
    secret: 'Nu o fost niciodata sa nu fie cumva!',
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
mongoose.connect(`${url}/tracking_app`, { useNewUrlParser: true, useUnifiedTopology: true });

//in caz ca primeste o ruta nedeclarata sa faca redirect la login
app.get('*', function (req, res) {
    res.redirect('/login');
});

//ascultam pe portul declarat mai sus
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})