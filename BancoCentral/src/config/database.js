module.exports = {
	dialect: 'postgres',
	host: 'localhost',
	port: 5433,
	username: 'postgres',
	password: 'admin',
	database: 'openfinance',
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
	},
};
