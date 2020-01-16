const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password: String,
    isAdmin: Boolean,
    location: [{
        lat: Number,
        long: Number,
        date: {
            type: Date,
            default: Date.now
        },
    }],
});

//adaugam o metoda de autentificare
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
    }, config.get('jwtPrivateKey')); 
    return token;
}

module.exports = mongoose.model('User', userSchema);