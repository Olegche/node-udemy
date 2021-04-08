const {Schema, model} = require('mongoose')

const Book = new Schema ({ 
title: {
    type: String,
    require: true,
},
price:{
    type: Number,
    require: true,
},
img: String,
description: {
    type: String,
    require: true,
    default: 'no description '
},
userId: {
    type: Schema.Types.ObjectId,
    ref:'User',
    require: true,
    default:'no userId'
    
}

})

Book.method('toClient', function(){
    const book = this.toObject() // отримаєм об'єкт книги

    book.id = book._id // в айді об'єкта книги присвоюєм обєкт
    delete book._id //  видаляємо лишні дані з об'єкта книги
    return book
})

module.exports = model('Book', Book)

//  Створення моделі без використання монгуса

// const {
//     v4: uuidv4
// } = require('uuid')
// const fs = require('fs')
// const path = require('path')

// class Book {
//     constructor(title, price, img, description) {
//         this.title = title
//         this.price = price
//         this.img = img
//         this.description = description
//         this.id = uuidv4()
//     }

//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id,
//             description: this.description
//         }
//     }
//     // За дапомогою функціЇ сейв пушимо в масив букс отриманий контент
//     async save() {
//         const books = await Book.getAllBooks()
//         books.push(this.toJSON())
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'books.json'),
//                 JSON.stringify(books),
//                 (err) => {
//                     if (err)
//                         reject(err)
//                     else resolve()
//                 }
//             )
//         })
//     }

//     static getAllBooks() {
//         return new Promise((resolve, reject) => {

//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'books.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) reject(err)
//                     else resolve(JSON.parse(content))
//                 }
//             )
//         })
//     }

//     static async getBookById(id){
//         const books = await Book.getAllBooks()
//         return books.find(book => book.id === id)
//     }

//     static async updateBookById(book) {
//         const books = await Book.getAllBooks()
//         const bookIndex = books.findIndex( myBook => myBook.id === book.id)
//         books[bookIndex] = book
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'books.json'),
//                 JSON.stringify(books),
//                 (err) => {
//                     if (err)
//                         reject(err)
//                     else resolve()
//                 }
//             )
//         })
//     }
// }

// module.exports = Book