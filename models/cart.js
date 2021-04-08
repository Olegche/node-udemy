//   Модель корзини без використання монгуса із збереження даних в окримий джейсон файл як базу данних
// const path = require('path')
// const fs = require('fs')


// class Cart {

//     static async add(book) {
//         const cart = await Cart.fetch()

//         const bookIndex = cart.books.findIndex(myBook => myBook.id === book.id) // шукаємо індекс книги в корзині, в масиві з книгами
//         const addedBook = cart.books[bookIndex] //  записуємо в змінну індекс доданої книги
//         //  якщо така книга вже додана то збільшуємо її кількість
//         if (addedBook) {
//             addedBook.count++ //  збільшуємо кількість на 1 доданої книги
//             cart.books[bookIndex] = addedBook // записуємо в корзину  додану книгу з індексом, який знайшли з кількістю + 1
//         }
//         // якщо такої книги ще в корзині немає, то записуємо кількість  1 і пушимо в масив корзини з книгами
//         else {
//             book.count = 1
//             cart.books.push(book)
//         }
//         // до загальної вартості в корзині додаємо вартість доданої книги з костильом + щоб не було конкотинації рядків (на всяк випадок) 

//         cart.price += +book.price
//         // записуємо в джейсон корзину
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'cart.json'),
//                 JSON.stringify(cart), err => {
//                     if (err)
//                         reject(err)
//                     else
//                         resolve()
//                 })
//         })

//     }

//     static async fetch() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(path.join(__dirname, '..', 'data', 'cart.json'), 'utf8', (err, content) => {
//                 if (err)
//                     reject(err)
//                 else
//                     resolve(JSON.parse(content))
//             })
//         })
//     }

//     static async remove(id) {
//         const cart = await Cart.fetch()

//         const index = cart.books.findIndex(book => book.id === id)
//         const book = cart.books[index]

//         if(book.count === 1) // видаляємо книгу якщо її кільскість становить 1 
//             cart.books = cart.books.filter(book=> book.id !== id) // метод видалення  заносимо в масив карт букс ті книги яких айді не відповідає данному айді
//         else{
//             cart.books[index].count-- // зменшуємо кільскість книг з даним індекстом на 1

//         }

//         cart.price -= book.price

//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'cart.json'),
//                 JSON.stringify(cart), err => {
//                     if (err)
//                         reject(err)
//                     else
//                         resolve(cart)
//                 })
//         })


//     }
// }
// module.exports = Cart