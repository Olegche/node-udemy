var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {validationResult} = require('express-validator/check')
const {signupValidators} = require('../utils/validators')
const{loginValidators} = require('../utils/validators')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const resetPassword = require('../emails/resetPassword')
const {
    SENGRID_API_KEY
} = require('../config')
const regEmail = require('../emails/signup')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: SENGRID_API_KEY
    }
}))




router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        signupError: req.flash('signupError'),
        loginError: req.flash('loginError')

    })
})


router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })


})


router.post('/login', loginValidators, async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const errors = validationResult(req) // в змінну errors  записуємо всі можливі поминки з  req
        if(!errors.isEmpty()) {
            req.flash('loginError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login')
        }
        const candidate = await User.findOne({
            email
        })
        if (candidate) {
            const isSameUser = await bcrypt.compare(password, candidate.password)
            if (isSameUser) {
                req.session.user = candidate
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err)
                        throw err
                    else
                        res.redirect('/')
                })

            } else {
                req.flash('loginError', 'Wrong password!')
                res.redirect('/auth/login#login')
            }

        } else {
            req.flash('loginError', 'No users with that email!')
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log(e);
    }

})

router.post('/signup', signupValidators, async (req, res) => {
    try {
        const {
            email,
            password,
            // confirm-password
            name
        } = req.body

        // const candidate = await User.findOne({
        //     email
        // })
        const errors = validationResult(req) // в змінну errors  записуємо всі можливі поминки з  req
        if(!errors.isEmpty()) {
            req.flash('signupError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#signup')
        }

        // if (candidate) {
        //     req.flash('signupError', 'email is already exist!')
        //     res.redirect('/auth/login#signup')
        // } else {
            const hashPassword = await bcrypt.hash(password, 10) // створюємо хеш пароля
            const user = new User({
                email,
                name,
                password: hashPassword, //   в поле пароля записуємо хеш пароля
                cart: {
                    items: []
                }
            })
            await user.save()
            await transporter.sendMail(regEmail(email))
            res.redirect('/auth/login#login')

        // }
    } catch (e) {
        console.log(e);
    }
})

router.get('/forget-password', (req, res) => {
    res.render('auth/forget-password', {
        title: 'Forget Password?',
        error: req.flash('error')

    })
})

router.post('/forget-password', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'oops  something went wrong')
                return res.redirect('auth/forget-password')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({
                 email: req.body.email
                })
            if (candidate) {
                const tokenTime = 60 * 60 * 1000
                candidate.resetEmailToken = token,
                candidate.resetEmailTokenExp = Date.now() + tokenTime
                await candidate.save()
                await transporter.sendMail(resetPassword(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'There are no users matching with that email')
                res.redirect('/auth/forget-password')
            }


        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/new-password/:token', async (req, res) => {
    if(!req.params.token)
    return res.redirect('/auth/login')

    try {
        const user = await User.findOne({ 
            resetEmailToken: req.params.token,
            resetEmailTokenExp: {$gt: Date.now()}
        })

        if(!user) 
           return res.redirect('/auth/login')
           else {
            res.render('auth/new-password', {
                title: 'New Password',
                error: req.flash('error'),
                userId : user._id.toString(),
                token: req.params.token
        
            })

           }

    } catch (error) {
        console.log(error);
    }
})

router.post('/new-password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetEmailToken: req.body.token,
            resetEmailTokenExp: {$gt: Date.now()}
        })

        if (user){
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetEmailToken = undefined
            user.resetEmailTokenExp= undefined
            await user.save()
            res.redirect('/auth/login')
        } 
        else
        req.flash('LoginError','Expired token')
        res.redirect('/auth/login')
    } catch (error) {
        console.log(error);
    }
})
module.exports = router