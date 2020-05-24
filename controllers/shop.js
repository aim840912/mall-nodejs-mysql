const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
	Product.findAll().then((products) => {
		res.render('shop/product-list', {
			prods: products,
			docTitle: '產品中心',
			activeProductList: true,
			breadcrumb: [
				{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
				{ name: '產品中心', hasBreadcrumbUrl: false },
			],
		})
	})
}

exports.getIndex = (req, res, next) => {
	Product.findAll()
		.then(products => {
			res.render('shop/index', {
				prods: products,
				docTitle: '商城',
				activeShop: true,
				breadcrumb: [
					{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
					{ name: '商城', hasBreadcrumbUrl: false },
				],
			})
		})
		.catch(err => {
			console.log(err)
		})
}

exports.getCart = (req, res, next) => {
	req.user.getCart((cart) => {
		cart.getProducts().then((products) => {
			res.render('shop/cart', {
				docTitle: '購物車',
				activeCart: true,
				breadcrumb: [
					{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
					{ name: '購物車', hasBreadcrumbUrl: false },
				],
				cartProducts: products
			})
		})
	})
}

exports.postAddToCart = (req, res, next) => {
	const productId = req.body.productId

	let newQuantity = 1
	let fetchedCart;

	req.user
		.getCart()
		.then((cart) => {
			if (!cart) {
				return req.user.createCart()
					.then((cart) => {
						fetchedCart = cart
						return cart.getProducts({ where: { id: productId } })
					})
			} else {
				fetchedCart = cart
				return cart.getProducts({ where: { id: productId } })
			}

		})
		.then((products) => {
			if (products.length === 0) {
				return Product.findByPk(productId)
			} else {
				let product = products[0]
				newQuantity = product.cartItem.quantity + 1
				return product
			}
		})
		.then(product => {
			return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
		})
		.then(() => {
			res.redirect('/cart')
		})
		.catch((err) => {
			console.log(err)
		});
}

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId

	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts({ where: { id: productId } })
		})
		.then(products => {
			const product = products[0]
			return product.cartItem.destroy()
		}).then(result => {
			res.redirect('/')
		}).catch((err) => {
			console.log(err)
		});
}

exports.getProductDetail = (req, res, next) => {
	const productId = req.params.productId

	// Product.findAll({ where: { id: productId } })
	// Product.findByPk(productId)
	Product.findOne({ where: { id: productId } })
		.then((product) => {
			res.render('shop/product-detail', {
				docTitle: '產品詳情',
				product: product,
				activeProductList: true,
				breadcrumb: [
					{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
					{ name: '產品中心', url: '/product-list', hasBreadcrumbUrl: true },
					{ name: '產品詳情', hasBreadcrumbUrl: false },
				],
			})
		}).catch(err => {
			console.log(err)
		})
}

exports.postCreateOrder = (req, res, next) => {
	let fetchedCart
	req.user.getCart()
		.then((cart) => {
			fetchedCart = cart
			return cart.getProducts()
		})
		.then(products => {
			// console.log(req.user.__protot__)
			return req.user
				.createOrder()
				.then((order) => {
					order.addProduct(
						products.map(product => {
							product.orderItem = { quantity: product.cartItem.quantity }
							return product
						})
					)
				}).catch((err) => {
					console.log(err)
				});
		}).then(result => {
			return fetchedCart.setProducts(null)
		}).then(result => {
			res.redirect('/checkout')
		})
		.catch((err) => {
			console.log(err)
		});
}

exports.getCheckout = (req, res, next) => {
	req.user.getOrder({ include: ['products'] }).then(orders => {
		res.render('shop/checkout', {
			docTitle: '訂單管理',
			activeCheckout: true,
			orders,
			breadcrumb: [
				{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
				{ name: '訂單管理', hasBreadcrumbUrl: false },
			],
		})
	})

}
