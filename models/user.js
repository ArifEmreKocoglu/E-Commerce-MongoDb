const getDb = require('../utility/database').getdb;
const mongodb = require('mongodb');

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : {};
        this.cart.items = cart ? cart.items : [];
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this);
    }

    getCart() {

        const ids = this.cart.items.map(i => { // ürün id'lerine göre dizi olarak döndürdük.
            return i.productId;
        });

        const db = getDb();

        return db.collection('products')
            .find({
                _id: {
                    $in: ids
                }

            })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    }
                });
            });
    }

    addToCart(product) {

        const index = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        const updatedCartItems = [...this.cart.items]; // bütün dizi elemanları almış oldum.
        let itemQuantity = 1;
        if (index >= 0) {
            itemQuantity = this.cart.items[index].quantity + 1;
            updatedCartItems[index].quantity = itemQuantity;
        } else {
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: itemQuantity
            });
        }
        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                {
                    $set: {
                        cart: {
                            items: updatedCartItems
                        }
                    }
                }
            )
    }
    static findById(userid) {
        const db = getDb();

        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectID(userid) }) // id si eşitmi koşulu bu
            .then(user => {
                return user;
            })
            .catch(err => { console.log(err) });
    }

    static findByUserName(username) {
        const db = getDb();

        return db.collection('users')
            .findOne({ name: username }) // namei si eşitmi koşulu bu
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => { console.log(err) });
    }

    deleteCartItem(productid) {

        const cartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productid.toString()
        });

        const db = getDb();

        return db
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                {
                    $set: {
                        cart: { items: cartItems }
                    }
                }
            )
    }

    addOrder() {
        // get cart

        // create order object

        // save order

        // update card

        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products.map(item => {
                        return {
                            _id : item.id,
                            name: item.name,
                            price: item.price,
                            imageUrl: item.imageUrl,
                            userId: item.userId,
                            quantity: item.quantity
                        }
                    }),
                    user: {
                        _id: mongodb.ObjectId(this._id),
                        name: this.name,
                        email: this.email
                    },
                    date: new Date().toLocaleString()
                }

                return db.collection('orders').insertOne(order);
            })
            .then(() => {
                this.cart = { items: [] };
                return db.collection('users')
                    .updateOne({ _id: new mongodb.ObjectId(this._id) },
                        {
                            $set: {
                                cart: {
                                    items: []
                                }
                            }
                        })
            })
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders')
                    .find({'user._id': new mongodb.ObjectId(this._id)})
                    .toArray();
    }
}

module.exports = User;