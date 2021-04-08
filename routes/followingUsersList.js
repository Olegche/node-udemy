// var express = require('express');
// var router = express.Router();
// const User = require('../models/user')
// const auth = require('../middleware/auth')

// function mapFollowingUser(followingUsersList) {
//     return followingUsersList.followingUsers.map(item => ({
//         ...item.followingUserId._doc,// спред оператором розгортаємо необхідні данні тайтл прайс айді без лишніх технічних полей які додає монгус
//         id: item.followingUserId.id

//     }))
// }

// router.get('/', auth, async (req, res) => {

//     const user = await req.user
//         .populate('followingUsersList.followingUsers.userId')
//         .execPopulate()
//     const followingUsers = mapFollowingUser(user.followingUsersList)


//     res.render('followingUsersList', {
//         title: 'followingUsersList',
//         isfollowingUsersList: true,
//         followingUsers

//     })

// })

// module.exports = router