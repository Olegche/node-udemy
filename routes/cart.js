var express = require('express');
var router = express.Router();
const Book = require('../models/book')
const auth = require('../middleware/auth')

// const Cart = require('../models/cart')

function mapCartItems(cart) {
    return cart.items.map(item => ({
        ...item.bookId._doc,// спред оператором розгортаємо необхідні данні тайтл прайс айді без лишніх технічних полей які додає монгус
        id: item.bookId.id, 
        count: item.count

    }))
}

function reducePrice(books) {
    return books.reduce((totalPrice, book) => {
        return totalPrice += book.price * book.count
    }, 0)

}

router.post('/add-to-cart', auth, async (req, res) => {
    const book = await Book.findById(req.body.id)
   
    await req.user.addBookToCart(book)
    res.redirect('/cart')
})

router.get('/', auth, async (req, res) => {

    const user = await req.user
        .populate('cart.items.bookId')
        .execPopulate()
    const books = mapCartItems(user.cart)


    res.render('cart', {
        title: 'Cart',
        books: books,
        price: reducePrice(books),
        isCart: true
    })

})

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.bookId').execPopulate()
    const books = mapCartItems(user.cart)
    const cart = {
        books,
        price: reducePrice(books)

    }
    res.status(200).json(cart)
})

module.exports = router