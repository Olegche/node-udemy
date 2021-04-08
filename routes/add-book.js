var express = require('express');
var router = express.Router();
const Book = require('../models/book')
const auth = require('../middleware/auth')
const {validationResult} = require('express-validator/check')
const {addBooksValidators} = require('../utils/validators')



/* GET users listing. */
router.get('/', auth, function (req, res, next) {
    res.render('add-book', {
        title: 'Add new book',
        isAddBook: true
    });
});

router.post('/', auth, addBooksValidators, async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('add-book', {
            title: 'Add new book',
            isAddBook: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img:  req.body.img,
                description: req.body.description
            }
        })
        
    }

    // const book = new Book(req.body.title, req.body.price, req.body.img, req.body.description)
    const book = new Book({
        title: req.body.title,
        price: req.body.price,
        img: req.file ? req.file.path : 'https://static.thenounproject.com/png/220984-200.png',
        description: req.body.description,
        userId: req.user
    })
    try {
        await book.save();
        
        res.redirect('/books')

    } catch (err) {
        console.log(err);
    }


   console.log(`111111111${req.user}`);

})


module.exports = router;