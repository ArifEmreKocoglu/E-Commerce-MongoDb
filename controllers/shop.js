const Product = require('../models/product');
const Category = require('../models/category');
exports.getIndex =  (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.  
    // const products = Product.getAll(); // BÜTÜN ÜRÜNLERİ GÖNDERİR
    Product.findAll()
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/index', {title: 'Shopping', products: products, categories: categories ,path : '/'}); // PUG DOSYASI EKLEME BÖYLE ÜSTEKİ HTML            
                })
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProducts =  (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.  
    // const products = Product.getAll(); // BÜTÜN ÜRÜNLERİ GÖNDERİR
    Product.findAll()
    .then(products => {
        Category.findAll()
                .then(categories => {
                    res.render('shop/products', {title: 'Products', products: products,categories: categories ,path : '/'}); // PUG DOSYASI EKLEME BÖYLE ÜSTEKİ HTML
                })
    })
    .catch((err) => {

        console.log(err);
    })
}
exports.getProductsByCategoryId =  (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.
    const categoryid = req.params.categoryid;
    const model = [];
    
    Category.findAll()
        .then(categories =>{
            model.categories = categories;
            return Product.findByCategoryId(categoryid);
        })
        .then(products =>{
            res.render('shop/products', {
                title: 'Products', 
                products: products, 
                categories: model.categories,
                selectedCategory: categoryid, 
                path : '/products'
            }); // PUG DOSYASI EKLEME BÖYLE ÜSTEKİ HTML
        })
        .catch((err) =>{
            console.log(err);
        })

    
}

exports.getProduct =  (req, res, next)=>{
    Product.findById(req.params.productid) // id bilgisine göre seçme yapar.
        .then((product)=>{
            res.render('shop/product-detail', {
                title: product.name,
                product: product,
                path: '/products' 
            });
        })
        .catch((err) =>{
            console.log(err);
        });

    
}


exports.getCart =  (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.  
    req.user
        .getCart()
        .then(products =>{
            res.render('shop/cart', {title: 'Cart',products: products ,path : '/cart'}); // PUG DOSYASI EKLEME BÖYLE ÜSTEKİ HTMLL
        })
        .catch(err =>{
            console.log(err);
        })
}


exports.postCart =  (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.  
    
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {console.log(err)});
}

exports.postCartItemDelete =  (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.  
    const productid = req.body.productid;

    req.user
        .deleteCartItem(productid)
        .then(result =>{
            res.redirect('/cart');
        });
}


exports.getOrders =  (req, res, next)=>{
   // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.  
   req.user
    .getOrders()
    .then(orders => {
        res.render('shop/orders', {
            title: 'Orders',
            path: '/orders',
            orders: orders
        });
    })
    .catch(err => {console.log(err)});
      
}

exports.postOrders =  (req, res, next)=>{
    req.user    
        .addOrder()
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {console.log(err)});
}

