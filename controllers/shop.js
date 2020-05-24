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
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = []

			for (product of products) {
				const cartProductData = cart.products.find((prod) => prod.id === product.id)

				if (cartProductData) {
					cartProducts.push({ ...product, qty: cartProductData.qty })
				}
			}

			res.render('shop/cart', {
				docTitle: '購物車',
				activeCart: true,
				breadcrumb: [
					{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
					{ name: '購物車', hasBreadcrumbUrl: false },
				],
				cartProducts,
				totalPrice: cart.totalPrice,
			})
		})
	})
}

exports.postAddToCart = (req, res, next) => {
	const productId = req.body.productId

	console.log(productId)

	Product.findById(productId, (product) => {
		Cart.addProduct(productId, product.price)
	})

	res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId

	Product.findById(productId, (product) => {
		Cart.deleteProduct(productId, product.price)
	})

	res.redirect('/cart')
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

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		docTitle: '訂單管理',
		activeCheckout: true,
		breadcrumb: [
			{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
			{ name: '訂單管理', hasBreadcrumbUrl: false },
		],
	})
}
