
const getDb = require('../utility/database').getdb;
const mongodb = require('mongodb');
class Product{
    constructor(name, price, description, imageUrl, categories ,id, userId) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.categories = (categories && !Array.isArray(categories)) ? Array.of(categories) : categories;
        this._id = id ? new mongodb.ObjectID(id) : null ;
        this.userId = userId;
    }

    save() {
        let db = getDb();

        if (this._id){// products collectionuna veri eklemesi yaptık.
           db = db.collection('products').updateOne({_id: this._id}, {$set: this});
        }else{// products collectionuna veri eklemesi yaptık.
           db = db.collection('products').insertOne(this)
        }
        return db
            .then(result =>{
                console.log(result);
            })
            .catch(err => {console.log(err)});
    }

    static findAll() {
        const db = getDb();
       return db.collection('products') // admin controllra promise döndürmek için return koyduk
            .find()
            .project({name:1, price:1, imageUrl:1}) // find metoduyl hepsi geldiği için burada neleri istedğimizi seçebiliriz.
            .toArray()
            .then(products =>{
                return products;
            })
            .catch(err => {console.log(err)});
    }
    static findById(productid){
        const db = getDb();

                   /***************1. YOL BİR ELEMAN GETİRMEK İÇİN************* */

        // return db.collection('products')
        //     .find({_id: new mongodb.ObjectID(productid)})
        //     .toArray()
        //     .then(products =>{
        //         return products;

        //     })
        //     .catch(err =>{console.log(err)});

                    /***************2. YOL BİR ELEMAN GETİRMEK İÇİN************* */
        return db.collection('products')
            .findOne({_id: new mongodb.ObjectID(productid)})
            .then(product =>{
                return product;
            })
            .catch(err => {console.log(err)});

    }

    static deleteById(productid)
    {
        const db = getDb();
            return db.collection('products')
                    .deleteOne({_id: new mongodb.ObjectID(productid)})
                    .then(() =>{
                        console.log('deleted');
                    })
                    .catch(err => {console.log(err)});
    }

    static findByCategoryId(categoryid){
        const db = getDb();
            return db.collection('products')
                .find({categories: categoryid})
                .toArray()
                .then(products => {
                    return products;
                })
                .catch(err => {console.log(err)});
    }
}

module.exports = Product;