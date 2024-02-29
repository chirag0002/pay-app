const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { number } = require('zod');
dotenv.config();

mongoose.connect(process.env.DB);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        maxlength: 64,
        minlength: 3,
        required: true,
        lowercase: true,
        trim: true
    },
    first_name: {
        type: String,
        maxlength: 64,
        trim: true,
        minlength: 3,
        required: true
    },
    last_name: {
        type: String,
        maxlength: 64,
        trim: true,
        minlength: 3,
        required: true
    },
    email: {
        type: String,
        trim: true,
        maxlength: 128
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        maxlength: 64
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }

})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
};
