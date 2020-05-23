const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');
const errorController = require('./controllers/error.js')
const sequelize = require('./util/database')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRoutes);

app.use('/admin', adminRoutes);

app.use(errorController.get404);

sequelize.authenticate().then(() => {
    console.log('connect SQL success')
}).catch(err => {
    console.log(err, 'connect failed')
})

app.listen(3000);
