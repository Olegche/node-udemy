var express = require('express');
var router = express.Router();
const Order = require('../models/order')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {

    try {
        const orders =  await Order.find({'user.userId':req.user._id })
        .populate('user.userId')

        res.render('orders', {
            title: 'Orders',
            isOrder: true,
            orders: orders.map(order => {
                return {
                    ...order._doc,
                    price: order.books.reduce((totalPrice, item) => {
                        return totalPrice += item.count * item.book.price
                    },0)
                }
            })
            
        })
        console.log(`1111111111111111 ${orders} 1`);
    } catch (error) {
        console.log(error);
    }
    
});

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.bookId')
            .execPopulate()

        const books = user.cart.items.map(item => ({
            count: item.count,
            book: {
                ...item.bookId._doc
            }
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            books: books
        })

        await order.save()
        await req.user.clearCart()

        res.redirect('/orders')

    } catch (error) {
        console.log(error);
    }

})
module.exports = router