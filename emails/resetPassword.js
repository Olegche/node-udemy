const {EMAIL_FROM, BASE_URL} = require('../config')

module.exports = function(email, token) {
    return {
        to: email,
        from: EMAIL_FROM,
        subject: 'Reset password',
        html: `
        <h1> Do You want to reset your password for ${email}?</h1>
        <p> if no, ignore this email message</p>
        <p> else,  click on the  link below</p>
        <p> <a href="${BASE_URL}/auth/new-password/${token}">reset password</a></p>
        <hr/>
        <a href="${BASE_URL}">to node-book website</a>
        `
    }
}