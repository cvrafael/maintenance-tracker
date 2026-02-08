const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Runin = require('../models/Runin')(sequelize, Sequelize);
db.Rack = require('../models/Rack')(sequelize, Sequelize);
db.Position = require('../models/Position')(sequelize, Sequelize);

// associações
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
