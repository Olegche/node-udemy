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
            .select('price title img  userId')

        let friends = req.user.friendsList.friends

        const filteredBooks = [] //  філтеред букс це книги які можуть бачити ті користувачі які є в друзях і які є авторами публікації цих книг
        for (const book of books) {
            for (const friend of friends) {
                if (friend.friendId.toString() === book.userId._id.toString()) {
                    filteredBooks.push(book)
                }
            }
        }

        res.render('books', {
            title: 'Books',
            isbooks: true,
            userId: req.user ? req.user._id.toString() : null,
            books,
            filteredBooks
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
        const book = await Book.findById(req.params.id).populate('userId', 'email name avatar')
            .populate('comments.commentator')
            .select('price title img description comments')
        res.render('current-book', {
            layout: 'aboutBook',
            title: book.title,
            book,
            userId: req.user ? req.user._id.toString() : null,

        })
    } catch (e) {
        console.log(e);
    }

})
////
router.post('/add-comment', auth, async (req, res) => {

    try {
        let comment = req.body.comment
        const book = await Book.findById(req.body.id)
        book.userId = req.user._id
        const commentator = await req.user

        await book.addComment(comment, commentator)
        return res.redirect(`/books/${book._id}`)

    } catch (e) {
        console.log(e)
    }

})
////
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