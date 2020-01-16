const config = require('config');
const jwt = require('jsonwebtoken');

var middlewareObject = {};

/*
=================================
        Login Checkers
=================================
*/

middlewareObject.redirectLogin = function (req, res, next) {
    if (req.session.adminEmail) {
        return next();
    }
    return res.redirect('/login');
};

middlewareObject.redirectMonitor = function (req, res, next) {
    if (req.session.adminEmail) {
        return res.redirect('/monitor');
    }
    return next();
};

middlewareObject.denyLogout = function (req, res, next) {
    if (req.session.adminEmail) {
        return next();
    }
    return res.status(400).send('You are not logged in!');
};

/*
=================================
        Valid Checkers
=================================
*/

middlewareObject.validLocation = function (req, res, next) {
    if (!((req.body.long) && (req.body.lat))) {
        return res.status(400).send('No location sent!');
    }
    else {
        const location = req.body.lat + ', ' + req.body.long;
        const re = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
        if (!re.test(String(location))) {
            return res.status(400).send('Invalid location!');
        }
        return next();
    }
}

middlewareObject.validEmail = function (email) {
    const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

middlewareObject.validPassword = function (password) {
    //sa fie de 8 caractere cu cel putin o cifra si o litera
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(password));
}

middlewareObject.validLogin = function (req, res, next) {
    if (!middlewareObject.validEmail(req.body.email)) {
        return res.status(400).send('Invalid data sent!');
    }
    if (!middlewareObject.validPassword(req.body.password)) {
        return res.status(400).send('Invalid data sent!');
    }
    return next();
}

middlewareObject.validRegister = function (req, res, next) {
    if (!((req.body.firstName) && (req.body.lastName))) {
        return res.status(400).send('Invalid data sent!');
    }
    if (!middlewareObject.validEmail(req.body.email)) {
        return res.status(400).send('Invalid data sent!');
    }
    if (!middlewareObject.validPassword(req.body.password)) {
        return res.status(400).send('Invalid data sent!');
    }
    return next();
}

/*
=================================
        Token Checkers
=================================
*/

middlewareObject.validToken = function (req, res, next) {
    try {
        const decoded = jwt.verify(req.body.jwt, config.get('jwtPrivateKey'));
    }
    catch (ex) {
        return res.status(400).send('Invalid Token!');
    }
    return next();
}


module.exports = middlewareObject;