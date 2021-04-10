var createError = require('http-errors');
var express = require('express');
var path = require('path');
var csurf = require('csurf')
var flash = require('connect-flash')  
// const helmet = require('helmet') //  додає хедери для безепеки додатка
const compression = require('compression')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs')
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/userMiddleware')
const fileMiddleware = require('./middleware/file')




// const User = require('./models/user')


var app = express();
const {port, databaseName, mongoURI, sessionSECRET}=require('./config')
console.log(`Your port    : ${port}`);  
console.log(`Database name: ${databaseName}`); 
require('./db')

const store = new MongoStore({
  collection: 'sessions',
  uri : mongoURI

})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');
var addBookRouter = require('./routes/add-book')
var cartRouter = require('./routes/cart')
var ordersRouter = require('./routes/orders')
var authRouter = require('./routes/auth')
var profileRouter = require('./routes/profile')
var friendsRouter = require('./routes/friends')

hbs.registerPartials(__dirname + '/views/partials')

hbs.registerHelper('ifeq', function (a,b, options) {
  if (a==b) {
      return options.fn(this)
  } 
  else
return  options.inverse(this)
})




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: sessionSECRET,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(fileMiddleware.single('img'))

app.use(csurf())
app.use(flash())
// app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

//   має бути вище ніж інші app.use  з роутами тут---
// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById('604b8d9476b9bafe78ed3ac8')
//     req.user = user
//     next()
//   } catch (e) {
//     console.log(e)
//   }
// })
//-----
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/add-book',addBookRouter)
app.use('/cart',cartRouter)
app.use('/orders',ordersRouter)
app.use('/auth', authRouter )
app.use('/profile', profileRouter)
app.use('/friends', friendsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  

  // render the error page
  res.status(err.status || 500);
 
  res.render('error');
});


// async function start() {
//   try {
    
//     const candidate = await User.findOne()
//     if (!candidate) {
//       const user = new User({
//         email: 'develope@gmail.com',
//         name: 'Oleg',
//         cart: {items: []}
//       })
//       await user.save()
//     }
    
//   } catch (e) {
//     console.log(e)
//   }
// }
// start()


module.exports = app;
