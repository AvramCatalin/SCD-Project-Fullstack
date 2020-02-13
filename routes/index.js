const express = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const User = require('../models/user');
const middleware = require('../middleware');
const router = express.Router();

/*
=================================
            Register
=================================
*/

router.get('/register', middleware.redirectMonitor, (req, res) => {
    res.render('register', { error: req.query.error });
});

router.post('/admin', middleware.redirectMonitor, middleware.validRegister, (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newAdmin = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: (req.body.email).toLowerCase(),
        password: hash,
        isAdmin: true
    });
    User.find({ email: req.body.email.toLowerCase() }, (req, res) => {
        if (users.length === 0) {
            newAdmin.save((err, user) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(user);
                    res.redirect('/login');
                }
            });
        } else {
            res.status(400).send();
        }
    })
});

/*
=================================
            Login
=================================
*/

router.get('/login', middleware.redirectMonitor, (req, res) => {
    res.render('login', { error: req.query.error });
});

router.post('/login', middleware.redirectMonitor, middleware.validLogin, (req, res) => {
    User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            if (user !== null) {
                if ((bcrypt.compareSync(req.body.password, user.password)) && (user.isAdmin)) {
                    req.session.adminEmail = user.email;
                    res.redirect('/monitor');
                }
                else {
                    res.status(404).send();
                }
            }
            //altfel daca userul nu a fost gasit
            else {
                res.status(404).send();
            }
        }
    });
});

// <=> Deautentificare (stiu ca nu exista cuvantul) <=>
router.get('/logout', middleware.denyLogout, (req, res) => {
    req.session.destroy( (err) => {
        if (err) {
            console.log(err)
        }
        res.clearCookie('sid')
        res.redirect('/login');
    });
});

/*
=================================
            Monitor
=================================
*/

router.get('/monitor', middleware.redirectLogin, (req, res) => {
    res.render('monitor', {
        adminEmail: req.session.adminEmail,
        googleMapsKey: config.get('googleMapsKey')
    });
});   

module.exports = router;