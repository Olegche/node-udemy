const {
    body
} = require('express-validator/check')
const User = require('../models/user')

exports.loginValidators = [
    body('email', 'Enter correct email, please!')
    .isEmail(),

    body('password', 'Password has to contain min 6 symbols')
    .isLength({
        min: 6,
        max: 30
    })
    .isAlphanumeric()
    
]
exports.signupValidators = [
    body('email')
    .isEmail().withMessage('Enter your correct email, please !')
    .custom(async (value, {
        req
    }) => {
        try {
            const user = await User.findOne({
                email: value
            })
            if (user) {
                return Promise.reject('Email is already exist!')
            }
        } catch (e) {
            console.log(e);
        }
    })
    // .normalizeEmail() // санітайзер для введення та збереження корректних даних
    .trim(),

    body('password', 'Password has to contain min 6 symbols')
    .isLength({
        min: 6,
        max: 30
    })
    .isAlphanumeric()
    .trim(),

    body('confirm-password')
    .custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm password correctly, please!')
        }
        return true
    }),
    body('name', 'Name must contains min 3 symbols!')
    .isLength({
        min: 2,
        max: 30
    })
    .trim()

]

exports.addBooksValidators = [
    body('title', 'min 3 symbols, max 100 symbols')
    .isLength({
        min: 3,
        max: 100
    })
    .trim(),

    body('price', 'Enter correct price, please!')
    .isNumeric()
    .trim(),

    // body('img', 'Enter correct url image, please!')
    // .isURLis(),

    // body('description', 'Enter correct description, please!')
    // .isString()

]