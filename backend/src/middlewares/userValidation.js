const { User } = require('../db/db');
const { userSignUpValidator, userSignInValidator } = require('../utils/validator');
const bcrypt = require('bcrypt');


async function userSignUpValidation(req, res, next) {
    const { username, first_name, last_name, email, password } = req.body;

    try {
        const validation = userSignUpValidator(username, first_name, last_name, email, password);
        if (!validation.success) {
            const errs = validation.error.errors;
            return res.status(400).json({
                errors: errs.map(err => ({
                    param: err.path[0],
                    message: err.message
                }))
            });
        }

        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                errors: [
                    {
                        param: "email",
                        message: "User with this email address already exists."
                    }
                ]
            });
        } else {
            next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    };
};

async function userSignInValidation(req, res, next) {
    const { email, password } = req.body;

    try {
        const validation = userSignInValidator(email, password);
        if (!validation.success) {
            const errs = validation.error.errors;
            return res.status(400).json({
                errors: errs.map(err => ({
                    param: err.path[0],
                    message: err.message
                }))
            });
        } 

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                errors: [
                    {
                        param: "email",
                        message: "User with this email does not exist."
                    }
                ]
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(403).json({
                errors: [
                    {
                        param: "password",
                        message: "Incorrect password."
                    }
                ]
            })
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    };

}

module.exports = {
    userSignUpValidation,
    userSignInValidation
};