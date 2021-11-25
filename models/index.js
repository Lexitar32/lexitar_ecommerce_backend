const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  pool: {
    min: 1,
    max: 5,
    acquire: 10000,
    idle: 5000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected To The Database Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.users = require('./user.model')(sequelize, Sequelize);

module.exports = db;
