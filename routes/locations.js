const express = require("express");
const User = require('../models/user');
const middleware = require('../middleware');
const router = express.Router({ mergeParams: true });
//setam optiune mergeParams true altfel nu o sa poata citi param trimis
//motiv: am scurtat aici rutele dar in app.js exista prefixul lor

/*
=================================
        Set user location
=================================
*/

router.post('/', middleware.validLocation, function (req, res) {
    User.findOne({ email: req.params.userEmail }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            if (user) {
                user.location.push({
                    lat: (Number)(req.body.lat),
                    long: (Number)(req.body.long)
                });
                user.save(function (err, user) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.status(200).send();
                        console.log(user);
                    }
                });
            }
            else {
                res.status(404).send('User not found!');
            }
        }
    });
});

/*
=================================
        Get user location
=================================
*/

router.get('/', middleware.redirectLogin, function (req, res) {
    User.findOne({ email: req.params.userEmail.toLowerCase() }).sort({ date: 'asc' }).exec(function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            if (user !== null) {
                var dataToSend = [];
                user.location.forEach(loc => {
                    let stringDate = constructDate(loc.date);
                    if (dateChecker(req.query.start, req.query.end, Date.parse(stringDate))) {
                        dataToSend.push({
                            lat: loc.lat,
                            long: loc.long
                        });
                    }
                });
                res.send(dataToSend);
            }
            else {
                console.log("No user found! Check 'monitor' page!");
                res.status(404).send()
            }
        }
    });
});

/*
=================================
        Additional Function
=================================
*/
function constructDate(date)
{
    let day = date.getDate();
    if(day < 10)
    {
        day = '0' + day;
    }
    let month = date.getMonth() + 1;
    if(month < 10)
    {
        month = '0' + month;
    }
    let year = date.getFullYear();
    return (`${year}-${month}-${day}`);
}

function dateChecker(startDate, endDate, date) {
    if ((startDate === "") && (endDate === "")) {
        return true;
    }
    if (startDate === "") {
        if (date <= Date.parse(endDate)) {
            return true;
        }
    }
    if (endDate === "") {
        if (date >= Date.parse(startDate)) {
            return true;
        }
    }
    else {
        if ((date >= Date.parse(startDate)) && (date <= Date.parse(endDate))) {
            return true;
        }
    }
    return false;
}

module.exports = router;