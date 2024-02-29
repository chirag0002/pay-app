const { User } = require('../db/db');
const jwt = require('jsonwebtoken');

async function userAuthorization(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            errors: [{
                message: "You need to sign in to proceed."
            }]
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            errors: [{
                message: "You need to sign in to proceed."
            }]
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(403).json({
                errors: [{
                    message: "Auth token is invalid."
                }]
            });
        }
        if (user._id == decoded.userId) {
            req.user = user;
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(403).json({
            errors: [{
                message: "Auth token is invalid."
            }]
        });
    }
}

module.exports = userAuthorization;