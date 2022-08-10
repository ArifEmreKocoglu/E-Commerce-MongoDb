const Product = require('../models/product');
const Category = require('../models/category');


exports.getProducts =  (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../', 'views', 'index.html')); // res hem sonlanır hemde içerik yazılabilir.  
    // const products = Product.getAll(); // BÜTÜN ÜRÜNLERİ GÖNDERİR
   
    Product.findAll()
    .then(products => {
        res.render('admin/products', {title: 'Admin Page', products: products ,action: req.query.action , path :'/admin/products'}); // PUG DOSYASI EKLEME BÖYLE ÜSTEKİ HTML
    })
    .catch((err) => {

        console.log(err);
    })
 }

 exports.getAddProduct = (req, res, next)=>{ // sadece get için çalışır.
    // res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
    res.render('admin/add-product', {title:'New Product',path : '/admin/add-product'});
}

exports.postAddProduct = (req, res, next)=>{ //app.post yapmamızın sebebi içine bişey geldiğinde çalışmasını sağlamak.
    //data base kayıt.
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

    const product = new Product(name, price, description, imageUrl, null, req.user._id);
    product.save()
    .then(result =>{
        res.redirect('/admin/products');
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.getEditProduct = (req, res, next)=>{ // sadece get için çalışır.
    Product.findById(req.params.productid)
        .then(product => {
            Category.findAll()
                .then(categories => {
                    categories = categories.map(category => {
                        product.categories.find(item => {
                            if (item == category._id){
                                category.selected = true;
                            }
                        })
                        return category;
                    })
                    res.render('admin/edit-product', {title:'Edit Product',path : '/admin/products', product: product, categories: categories});
                })
        })
        .catch(err =>{console.log(err)});
    
}

exports.getAddCategory = (req, res, next) => {
    res.render('admin/add-category', {title:'New Category',path : '/admin/add-category'});
}

exports.getCategories = (req, res, next)=>{
    Category.findAll()
    .then(categories => {
        res.render('admin/categories', {title: 'Categories', categories: categories, action: req.query.action , path :'/admin/categories'}); // PUG DOSYASI EKLEME BÖYLE ÜSTEKİ HTML
    })
    .catch((err) => {
        console.log(err);
    })
}

exports.postAddCategory = (req, res ,next) => {
    const name = req.body.name;
    const description = req.body.description;

    const category = new Category(name, description, null);
    category.save()
        .then(result =>{
            res.redirect('/admin/categories?action=create');
        })
        .catch(err =>{
            console.log(err);
        })
}

exports.postEditProduct = (req, res, next)=>{ //app.post yapmamızın sebebi içine bişey geldiğinde çalışmasını sağlamak.
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const categories = req.body.categoryids;
    
    const product = new Product(name, price ,description, imageUrl, categories ,id, req.user._id);
    product.save()
        .then(result =>{
            res.redirect('/admin/products?action=edit'); // anasayfaya yönlendir.
        }) // return kullanarak save in promisini burada yapıyoruz ortak
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productid;

    Product.deleteById(id) // gelen ile olan id eşleşirse siler.
        .then(() =>{
            res.redirect('/admin/products?action=delete');
        })
        .catch(err => {
            console.log(err);
        });    
}

exports.getEditCategory = (req, res, next) => {
    Category.findById(req.params.categoryid)
        .then(category => {
            console.log(category);
            res.render('admin/edit-category', {title:'Edit Category', path : '/admin/categories', category: category});
        })
        .catch(err =>{console.log(err)});
}

exports.postEditCategory = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    
    const category = new Category(name, description, id);

    category.save()
        .then(result =>{
            res.redirect('/admin/categories?action=edit'); // anasayfaya yönlendir.
        }) // return kullanarak save in promisini burada yapıyoruz ortak
        .catch(err => console.log(err));
}
