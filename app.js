const express = require('express')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const path = require('path')
const errorController = require('./controllers/error.js')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            // console.log(Object.keys(User.prototype))
            next()
        })
        .catch(err => {
            console.log(err)
        })
})

app.use(shopRoutes)

app.use('/admin', adminRoutes)

app.use(errorController.get404)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)


// sequelize.authenticate().then(() => {
//     console.log('connect SQL success')
// }).catch(err => {
//     console.log(err, 'connect failed')
// })
// app.listen(3000)

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Tien', email: 'tien@gmail.com' })
        }
        return user
    })
    .then(user => {
        if (user) {
            app.listen(3000, () => {
                console.log('App listening on port 3000')
            })
        }
    })
    .catch(err => {
        console.log(err)
    })

