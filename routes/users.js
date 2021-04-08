var express = require('express');
var router = express.Router();
const User = require('../models/user')


/* GET users listing. */
router.get('/', async function(req, res, next) {

  const users = await User.find().select('name email avatar')
  res.render('users',{
    title: 'users',
    isUsers: true,
    users
    
  });
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  res.render('current-user', {
      layout: 'aboutUser',
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      user
  })
})

module.exports = router;
