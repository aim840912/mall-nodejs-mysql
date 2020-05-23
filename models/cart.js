const rootDir = require('../util/path');
const path = require('path');
const fs = require('fs');
const dirPath = path.join(rootDir, 'data');
const filePath = path.join(dirPath, 'cart.json');

const getCartFromFile = (cb) => {
	Cart.checkFile().then((result) => {
		if (result) {
			fs.readFile(filePath, (err, data) => {
				if (err) {
					cb([]);
				}
				cb(JSON.parse(data));
			});
		}
	});
};

class Cart {
	static checkFile = () => {
		const promise = new Promise((resolve, reject) => {
			fs.exists(dirPath, (result) => {
				if (!result) {
					fs.mkdir(dirPath, (err) => {
						if (!err) {
							fs.writeFile(filePath, '{"products":[],"totalPrice":0}', (err) => {
								resolve(true);
							});
						}
					});
				} else {
					fs.exists(filePath, (blCheckFile) => {
						if (!blCheckFile) {
							fs.writeFile(filePath, '{"products":[],"totalPrice":0}', (err) => {
								resolve(true);
							});
						} else {
							resolve(true);
						}
					});
				}
			});
		});
		return promise;
	};

	static addProduct(id, productPrice) {
		getCartFromFile((cart) => {
			// 先進行查詢匹配
			const existsProductIndex = cart.products.findIndex((prod) => prod.id === id);
			let updateProduct = false;

			if (existsProductIndex === -1) {
				updateProduct = { id: id, qty: 1 };
				cart.products.push(updateProduct);
			} else {
				let existsProduct = cart.products[existsProductIndex];
				updateProduct = { ...existsProduct };
				updateProduct.qty = existsProduct.qty + 1;
				cart.products[existsProductIndex] = updateProduct;
			}

			cart.totalPrice = cart.totalPrice + +productPrice;

			fs.writeFile(filePath, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
	}

	static getCart(cb) {
		getCartFromFile((cart) => {
			cb(cart);
		});
	}

	static deleteProduct(id, productPrice) {
		getCartFromFile((cart) => {
			const updateCart = { ...cart };

			const product = updateCart.products.find((prod) => prod.id === id);

			if (!product) {
				return;
			}

			const productQty = product.qty;

			updateCart.products = updateCart.products.filter((prod) => prod.id !== id);

			updateCart.totalPrice = updateCart.totalPrice - productPrice * productQty;

			fs.writeFile(filePath, JSON.stringify(updateCart), (err) => {
				console.log(err);
			});
		});
	}
}

module.exports = Cart;
