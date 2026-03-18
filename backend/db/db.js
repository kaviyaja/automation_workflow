const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "workflow_engine",
  "postgres",
  "kaviya@2006",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false
  }
);

module.exports = sequelize;