const toCurrency = price =>{
  return new Intl.NumberFormat('de-DE', {
    currency: 'uah',
    style: 'currency'
  }).format(price)
}
//вибрали всі елементи з класом прайс і для кожного встановили формат валюти у гривні
document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
  })
  // видалення книги з корзини
   const cartDiv = document.querySelector('#cart')// дів з класом карт записуємо в змінну карт
   if(cartDiv) {
     cartDiv.addEventListener('click', event => {// додаємо прослуховувач подій з подією клік
       if(event.target.classList.contains('bnt-remove-book-from-cart')){//якщо подія відбулась на елементі який містить клас bnt-remove-book-from-cart
         const id = event.target.dataset.id // записуємо в змінну айді  ту айді яку отримали при події клік на елемент
         const csurf = event.target.dataset.csurf// записуємо в змінну csurf  той токен котрий отримали при події клік на елемент 
         
         fetch('/cart/remove/'+id, {
           method: 'delete',
           headers: { // в хелдері передаєм токен із значення змінної csurf
             'X-XSRF-TOKEN': csurf
           }
          
         })
         .then(res => res.json())
         .then(cart => {
         if(cart.books.length) {
           const html = cart.books.map(book => {
            return `
            <tr>
                <td>${book.title}</td>
                <td>${book.count}</td>
                <td>${book.price}</td>
                <td>
                    <button class="btn btn-small bnt-remove-book-from-cart" data-id="${book.id}">
                        X
                    </button>
                </td>
            </tr>
            `
           }).join('')
           cartDiv.querySelector('tbody').innerHTML = html
           cartDiv.querySelector('.price').textContent = toCurrency(cart.price) 
         }
         else {
           cartDiv.innerHTML = 'Cart is empty'
         }
         })
       }
     })
   }


const toDate = date => {
  return new Intl.DateTimeFormat('ua-UA', {
    day : '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}
document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent)
})

// таб для роута логін і реєстрація
M.Tabs.init(document.querySelectorAll('.tabs'))

