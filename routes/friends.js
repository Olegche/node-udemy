var express = require('express');
var router = express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth')

function mapFriends(friendsList) {
    return friendsList.friends.map(item => ({
        ...item.friendId._doc,// спред оператором розгортаємо необхідні данні тайтл прайс айді без лишніх технічних полей які додає монгус
        id: item.friendId.id, 
        

    }))
}

router.get('/', auth, async (req, res) => {

    const user = await req.user
        .populate('friendsList.friends.friendId')
        .execPopulate()
    const friends = mapFriends(user.friendsList)


    res.render('friends', {
        title: 'Friends',
        friends,
        isFriends: true
    })

})

router.post('/add-to-friends', auth, async (req, res) => {
    const candidate = await User.findById(req.body.id)
    const user = req.user
    const friends = user.friendsList.friends
    
    if(req.body.id.toString() === req.user._id.toString())  {
       return res.render('error', {
            title : 'You cant add to friends yourself'
        })
    }
    else if {
        const idx = friends.findIndex(item => {
            return item.friendId.toString() === candidate._id.toString()
          })
        
          if (idx >= 0) {
             return res.render('error', {
                  title : 'friend is already existing'
              })
    }
    ///
    
        ///
    else{
        await req.user.addToFriend(candidate)
            res.redirect('/friends')
    }
            
    
  
   
    


})


router.post('/delete-friend', auth, async (req, res) => {
    const candidate = req.body.id
await req.user.deleteFriends(candidate)

res.redirect('/friends')


})

    

module.exports = router