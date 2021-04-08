var express = require('express');
var router = express.Router();
const {
    validationResult
} = require('express-validator/check')
const {
    addBooksValidators
} = require('../utils/validators')
const Book = require('../models/book')
const auth = require('../middleware/auth');



function isOwner(book, req) {
    return book.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
            .populate('userId', 'email name')
            .select('price title img')


        res.render('books', {
            title: 'Books',
            isbooks: true,
            userId: req.user ? req.user._id.toString() : null,

            books
        })
    } catch (e) {
        console.log(e)
    }
})



router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow)
        return res.redirect('/')
    try {
        const book = await Book.findById(req.params.id)

        if (!isOwner(book, req)) {
            return res.redirect('/books')
        }

        res.render('edit-book', {
            title: `Edit ${book.title}`,
            book
        })
    } catch (e) {
        console.log(e);
    }

})

router.post('/edit', auth, addBooksValidators, async (req, res) => {
    const {
        id
    } = req.body
    const book = await Book.findById(id)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('add-book', {
            title: `Edit ${book.title}`,
            isAddBook: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
                description: req.body.description
            },
        })
    }
    try {
        const {
            id
        } = req.body
        delete req.body.id
        const book = await Book.findById(id)
        if (isOwner(book, req)) {
            await Book.findByIdAndUpdate(id, {
                title: req.body.title,
                price: req.body.price,
                img: req.file ? req.file.path : book.img,
                description: req.body.description

            })
            return res.redirect('/books')
        } else
            res.redirect('/books')
    } catch (e) {
        console.log(e)
    }
})



router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        res.render('current-book', {
            layout: 'aboutBook',
            title: book.title,
            book
        })
    } catch (e) {
        console.log(e);
    }

})

router.post('/delete', auth, async (req, res) => {
    try {
        await Book.findOneAndDelete({
            _id: req.body.id,
            userId: req.user._id
        })


        res.redirect('/books')
    } catch (error) {
        console.log(error);
    }


})


module.exports = router