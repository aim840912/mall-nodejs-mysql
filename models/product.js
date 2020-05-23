const { Sequelize } = require('sequelize')

const sequelize = require('../util/database')

const Product = sequelize.define('Product', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: Sequelize.STRING,
	price: {
		type: Sequelize.DOUBLE,
		allowNullL: false
	},
	imageUrl: {
		type: Sequelize.STRING,
		allowNullL: false
	},
	description: {
		type: Sequelize.TEXT,
		allowNullL: false
	}
})

module.exports = Product