const {EMAIL_FROM, BASE_URL} = require('../config')

module.exports = function(email) {
    return {
        to: email,
        from: EMAIL_FROM,
        subject: 'Account created',
        html: `
        <h1> Welcome to node books</h1>
        <p> You successfully created account with ${email}</p>
        <hr/>
        <a href="${BASE_URL}">to node-book website</a>
        `
    }
}