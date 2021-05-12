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
  avatar: String,
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
  },
  // start to extending app to create friends list
  friendsList: {
    friends: [{
      friendId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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


// friends functions

User.methods.addToFriend = function (user) {
  const friends = [...this.friendsList.friends]
  const idx = friends.findIndex(item => {
    return item.friendId.toString() === user._id.toString()
  })
  if (idx >= 0) {
    console.log('friend is already existing');
 
  } else {
    friends.push({
    friendId: user._id,

  })
  }
  this.friendsList = {
    friends
  }
  return this.save()
}

User.methods.deleteFriends= function (candidate) {
  let friends = [...this.friendsList.friends]
  friends = friends.filter(item => item.friendId.toString() !== candidate.toString())

  this.friendsList = {
    friends
  }
  return this.save()
}

// const newCart = {items: clonedItems}
// this.cart = newCart



module.exports = model('User', User)