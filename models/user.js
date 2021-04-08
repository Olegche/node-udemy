const {
  Schema,
  model
} = require("mongoose")

const User = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar : String,
  resetEmailToken: String,
  
  resetEmailTokenExp: Date,

  cart: {
    items: [{
      count: {
        type: Number,
        required: true,
        default: 1
      },
      bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', //  Данні витягуємо із моделі букс
        required: true

      }
    }]
  }
})

// User.methods.addBookToCart = function (book){
//     const copyItems = [...this.cart.items]
//     const bookIndex = copyItems.findIndex(item => {
//         return item.bookId.toString() === book._id.toString()
//     })
//     if(copyItems >=0){
//         copyItems[bookIndex].count = copyItems[bookIndex].count +1
//     } 
//     else {
//         copyItems.push({
//             bookId: book._id,
//             count: 1
//         })
//     }
//     this.cart = {
//         items : copyItems
//     }
//     return this.save()
// }


User.methods.addBookToCart = function (book) {
  const items = [...this.cart.items]
  const idx = items.findIndex(item => {
    return item.bookId.toString() === book._id.toString()
  })

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1
  } else {
    items.push({
      bookId: book._id,
      count: 1
    })
  }

  // const newCart = {items: clonedItems}
  // this.cart = newCart

  this.cart = {
    items
  }
  return this.save()
}

User.methods.removeFromCart = function (id) {
  let items = [...this.cart.items]
  const index = items.findIndex(item => item.bookId.toString() === id.toString())

  if (items[index].count === 1) {
    items = items.filter(item => item.bookId.toString() !== id.toString())
  } else
    items[index].count--

  this.cart = {
    items
  }
  return this.save()

}

User.methods.clearCart = function () {
  this.cart = {
    items: []
  }
  return this.save()
}

module.exports = model('User', User)