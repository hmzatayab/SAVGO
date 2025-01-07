const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        maxlength: [15, 'User must be at least 5 characters long'],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: [15, 'Name must be at least 5 characters long']
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minlength: [13, 'Email must be at least 13 characters long'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        trim: true
    },
    image: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    likes: {
        type: Number,
        default: 0
    }
});

const user = mongoose.model('user', userShema);
module.exports = user;
