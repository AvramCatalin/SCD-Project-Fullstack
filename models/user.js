const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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

module.exports = mongoose.model('User', UserSchema);