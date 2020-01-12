const express = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const middleware = require('../middleware');
const router = express.Router();

/*
=================================
            Register
=================================
*/

router.get('/register', middleware.redirectMonitor, function (req, res) {
    res.render('register', { error: "" });
});

router.post('/admin', middleware.redirectMonitor, middleware.validRegister, function (req, res) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newAdmin = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: (req.body.email).toLowerCase(),
        password: hash,
        isAdmin: true
    });
    User.find({ email: req.body.email.toLowerCase() }, function (err, users) {
        if (users.length === 0) {
            newAdmin.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(user);
                    res.redirect('/login');
                }
            });
        } else {
            res.render('register', { error: "Exista deja un user cu acest email!" });
        }
    })
});

/*
=================================
            Login
=================================
*/

router.get('/login', middleware.redirectMonitor, function (req, res) {
    res.render('login', { error: "" });
});

router.post('/login', middleware.redirectMonitor, middleware.validLogin, function (req, res) {
    User.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
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
                    res.render('login', { error: "Date de autentificare gresite!" });
                }
            }
            //altfel daca userul nu a fost gasit
            else {
                res.render('login', { error: "Date de autentificare gresite!" });
            }
        }
    });
});

// <=> Deautentificare (stiu ca nu exista cuvantul) <=>
router.get('/logout', middleware.denyLogout, function (req, res) {
    req.session.destroy(function (err) {
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

router.get('/monitor', middleware.redirectLogin, function (req, res) {
    res.render('monitor', {adminEmail: req.session.adminEmail});
});

module.exports = router;