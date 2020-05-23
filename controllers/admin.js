const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		docTitle: '添加產品',
		activeAddProduct: true,
		breadcrumb: [
			{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
			{ name: '添加產品', hasBreadcrumbUrl: false },
		],
		editing: false,
	});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;

	if (!editMode) {
		return res.redirect('/');
	}

	const productId = req.params.productId;

	Product.findById(productId, (product) => {
		if (!product) {
			return res.redirect('/');
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
		});
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;

	const product = new Product(title, imageUrl, description, price);
	product.save();
	res.redirect('/');
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const description = req.body.description;
	const price = req.body.price;

	const product = new Product(title, imageUrl, description, price);
	product.save(productId);
	res.redirect('/');
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;

	Product.deleteById(productId);

	res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll().then((products) => {
		res.render('admin/products', {
			prods: products,
			docTitle: '產品管理',
			activeProductManage: true,
			breadcrumb: [
				{ name: '首頁', url: '/', hasBreadcrumbUrl: true },
				{ name: '產品管理', hasBreadcrumbUrl: false },
			],
		});
	});
};
