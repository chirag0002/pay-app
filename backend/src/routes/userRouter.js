const { Router } = require('express');
const { User, Account } = require('../db/db');
const bcrypt = require('bcrypt');
const {userSignUpValidation, userSignInValidation} = require('../middlewares/userValidation');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userAuthorization = require('../middlewares/userAuth');

const router = Router();

router.post('/signup', userSignUpValidation, async (req, res) => {
    const { username, first_name, last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({
            username: username,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword
        })

        await user.save();

        const balance = crypto.randomInt(1, 10000);
        const account = new Account({
            balance: balance,
            userId: user._id
        });

        await account.save();

        const token = jwt.sign({ email: email, userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            message: 'User created successfully',
            token: `Bearer ${token}`,
            user: {
                id: user._id,
                first_name: user.first_name,
                balance: account.balance
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    };

});

router.post('/signin', userSignInValidation, async (req, res) => {
    const user = req.user;

    try {
        const account = await Account.findOne({userId:user._id});
        const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            token: `Bearer ${token}`,
            user: {
                id: user._id,
                first_name: user.first_name,
                balance: account.balance
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

router.put('/', userAuthorization, async(req, res) => {
    const user = req.user;
    const { username, first_name, last_name, email, password } = req.body;

    try {
        user.username = username || user.username;
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.password = await bcrypt.hash(password, 10) || user.password;

        await user.save();

        res.status(200).json({
            message: 'User updated successfully'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

router.get('/bulk', userAuthorization, async (req, res) => {
    try {
        const searchString = req.query.filter ? req.query.filter : '';
        const searchPattern = new RegExp(searchString, 'i');

        const users = await User.find({
            $or: [
                { first_name: { $regex: searchPattern } },
                { last_name: { $regex: searchPattern } }
            ]
        });
        res.status(200).json({
            users: users.map(user => ({
                    email: user.email,
                    name: (`${user.first_name} ${user.last_name}`),
                    userId: user._id
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;