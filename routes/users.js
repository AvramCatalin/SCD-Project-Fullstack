const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const middleware = require('../middleware');
const router = express.Router();

/*
=================================
            Register
=================================
*/

router.post('/', middleware.validRegister, function (req, res) {
    //hash-uim parola
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    //cream un obiect nou de tip User
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: (req.body.email).toLowerCase(),
        password: hash,
        isAdmin: false
    });
    //cauta daca nu exista cumva un user cu acelasi email in baza de date
    User.find({ email: req.body.email.toLowerCase() }, function (err, users) {
        //daca nu a gasit nimic, adica array-ul users e gol, salvam user-ul
        if (users.length === 0) {
            newUser.save(function (err, user) {
                //trimite ca raspuns status 201 (resursa creata)
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(user);
                    res.status(201).send('User created succesfully!');
                }
            });
        } else {
            //a gasit in baza de date user-ul deci trimite cod 400 (bad request)
            res.status(400).send('Bad request!');
        }
    });
});

/*
=================================
        Get All Users
=================================
*/

router.get('/', middleware.redirectLogin, function (req, res) {
    User.find({ isAdmin: false }, function (err, users) {
        if (users.length === 0) {
            console.log('There are no users!')
            res.status(404).send('Not found!');
        } else {
            let usersToSend = [];
            users.forEach(user => {
                usersToSend.push({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                });
            });
            res.send(usersToSend);
        }
    });
});

/*
=================================
            Login
=================================
*/

router.post('/login', middleware.validLogin, function (req, res) {
    User.findOne({ email: req.body.email.toLowerCase() }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            //daca user nu e null (adica a gasit userul)
            if (user !== null) {
                //functia de 'compare' de mai jos returneaza true atunci trimitem user-ul
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const token = user.generateAuthToken();
                    res.status(200).send({jwt: token});
                }
                else {
                    //daca userul a fost gasit dar nu e buna parola (raspundem ca si cand nu l-am fi gasit)
                    res.status(404).send('Not found!');
                }
            }
            //altfel daca userul nu a fost gasit
            else {
                res.status(404).send('Not found!');
            }
        }
    });
});

module.exports = router;