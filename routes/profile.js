var express = require('express');
const auth = require('../middleware/auth')
var router = express.Router();
const User = require('../models/user')


router.get('/',auth, async (req, res) => {
    res.render('profile', {
        title: 'My sweet profile',
        isProfile: true,
        email: req.user.email,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req, res) => {
try {
    const user = await User.findById(req.user._id)
    const toChange = {
        name : req.body.name
    }
    
    if(req.file){
        toChange.avatar = req.file.path
    }
    Object.assign(user, toChange)
    await user.save()
    res.redirect('/profile')
} catch (e) {
    console.log(e);
}
})

module.exports = router