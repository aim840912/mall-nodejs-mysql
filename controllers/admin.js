const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		docTitle: '添加產品',
		activeAddProduct: true,
		breadcrumb: [
			{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
			{ name: '添加產品', hasBreadcrumbUrl: false },
		],
		editing: false,
	})
}

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit

	if (!editMode) {
		return res.redirect('/')
	}

	const productId = req.params.productId

	req.user.getProducts({ where: { id: productId } })
		.then((products) => {
			const product = products[0]
			if (!products) {
				return res.redirect('/')
			}

			res.render('admin/edit-product', {
				docTitle: '修改產品',
				activeProductManage: true,
				breadcrumb: [
					{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
					{ name: '修改產品', hasBreadcrumbUrl: false },
				],
				editing: editMode,
				product,
			})
		})
		.catch((err) => {
			console.log(err)
		});

	// Product.findByPk(productId).then((product) => {
	// 	if (!product) {
	// 		return res.redirect('/')
	// 	}

	// 	res.render('admin/edit-product', {
	// 		docTitle: '修改產品',
	// 		activeProductManage: true,
	// 		breadcrumb: [
	// 			{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
	// 			{ name: '修改產品', hasBreadcrumbUrl: false },
	// 		],
	// 		editing: editMode,
	// 		product,
	// 	})
	// })
}

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title
	const imageUrl = req.body.imageUrl
	const description = req.body.description
	const price = req.body.price

	req.user
		.createProduct({ title, imageUrl, description, price })
		.then(result => {
			res.redirect('/admin/products')
		}).catch(err => {
			console.log(err)
		})

	// Product.create({ title, imageUrl, description, price, userId: req.user.id })
	// 	.then(result => {
	// 		console.log(result)
	// 		res.redirect('/admin/products')
	// 	}).catch(err => {
	// 		console.log(err)
	// 	})
}

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId
	const title = req.body.title
	const imageUrl = req.body.imageUrl
	const description = req.body.description
	const price = req.body.price

	// Product.findByPk(productId).then(product => {
	// 	product.title = title
	// 	product.description = description
	// 	product.imageUrl = imageUrl
	// 	product.price = price

	// 	return product.save()
	// }).then(result => {
	// 	res.resdir('/admin/products')
	// }).catch(err => {
	// 	console.log(err)
	// })

	Product.update({ title, imageUrl, description, price }, { where: { id: productId } })
		.then(([num]) => {
			console.log(num)
			res.redirect('/admin/product')
		}).catch((err) => {
			console.log(err)
		})
}

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId

	// Product.findByPk(productId).then((product) => {
	// 	return product.destroy()
	// }).then(result => {
	// 	res.redirect('/admin/products')
	// }).catch((err) => {
	// 	console.log(err)
	// })

	Product.destroy({ where: { id: productId } })
		.then((result) => {
			res.redirect('/admin/products')
		}).catch((err) => {
			console.log(err)
		});
}

exports.getProducts = (req, res, next) => {
	req.user.getProducts()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				docTitle: '產品管理',
				activeProductManage: true,
				breadcrumb: [
					{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
					{ name: '產品管理', hasBreadcrumbUrl: false },
				],
			})
		})

	// Product.findAll().then((products) => {
	// 	res.render('admin/products', {
	// 		prods: products,
	// 		docTitle: '產品管理',
	// 		activeProductManage: true,
	// 		breadcrumb: [
	// 			{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
	// 			{ name: '產品管理', hasBreadcrumbUrl: false },
	// 		],
	// 	})
	// })
}
