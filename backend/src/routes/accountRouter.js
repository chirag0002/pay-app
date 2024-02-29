const {Router} = require('express');
const userAuthorization = require('../middlewares/userAuth');
const {account, Account} = require('../db/db');
const { default: mongoose } = require('mongoose');


const router = Router();

router.get('/balance', userAuthorization, async(req, res) => {
    const user = req.user;
    try{
        const account = await Account.findOne({userId: user._id});
        res.status(200).json({
            balance: account.balance
        })
    } catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
});

router.post('/transfer', userAuthorization, async(req, res) => {
    const user = req.user;
    const {amount, to} = req.body;
    
    const a = parseInt(amount);

    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const account = await Account.findOne({userId: user._id}).session(session);
        if(account.balance < a){
            await session.abortTransaction();
            return res.status(400).json({
                message: 'Insufficient balance'
            })
        }
        const toAccount = await Account.findOne({userId: to}).session(session);
        if(toAccount){
            account.balance -= a;
            toAccount.balance += a;
            await account.save();
            await toAccount.save();
            await session.commitTransaction();
            res.status(200).json({
                message: 'Transfer successful'
            })
        } else {
            await session.abortTransaction();
            return res.status(400).json({
                message: 'Reciever account does not exist'
            })
        }
    } catch(err){
        console.error(err);
        await session.abortTransaction();
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

module.exports = router;