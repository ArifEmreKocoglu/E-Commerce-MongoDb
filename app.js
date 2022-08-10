const express = require('express');
const app = express(); // fonksyondan obje oluşturduk.
const bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', './views'); // pug dosyalarını views klasörüne atmaya yarar.

// const connection = require('./utility/database');

const adminRoutes = require('./routes/admin.js');
const userRoutes = require('./routes/shop.js');

const path = require('path');
const errorController = require('./controllers/errors');
const mongoConnect = require('./utility/database').mongoConnect;


const User = require('./models/user.js');



app.use(bodyParser.urlencoded({extended: false})); // body-parser post datasının obje olarak yakalamamızı sağlar.
app.use(express.static(path.join(__dirname, 'public'))); // dosyaları dışarı açmak için ÖNEMLİ FOTO VE CSS İN WEBE AÇILMASINI SAĞLAR

app.use((req, res, next) =>{
    User.findByUserName('arifemre')
        .then(user =>{
            req.user = new User(user.name, user.email, user.cart ,user._id); // her requesstin için de artık user olduğunu biliyor olacağız.
            next(); // devam ettirmemiz gerekir.
        })
        .catch(err => {console.log(err)});
})

//ROUTES
app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404Page);
mongoConnect(() =>{ // server Bağlantı işlemi.

    User.findByUserName('arifemre')
        .then(user => {
            if(!user){
                user = new User('arifemre', 'arifemre23@hotmail.com');
                return user.save();
            }
            return user;
        })
        .then(user => {
            console.log(user);
            app.listen(3000); // user  başarılı bir şekilde alındıktan sonra  başlatılır.
        })
        .catch(err => {console.log(err)});
});