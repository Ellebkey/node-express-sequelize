const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require('./config');
const logger = require('./winston');


const db = {};

// connect to sql db
const sequelize = new Sequelize(
  config.sql.db,
  config.sql.user,
  config.sql.password,
  {
    dialect: 'mysql',
    port: config.sql.port,
    host: config.sql.host,
    sync: true,
    logging: false,
    operatorsAliases: false
  },
);

const modelsDir = path.normalize(`${__dirname}/../server/models`);

// loop through all files in models directory ignoring hidden files and this file
fs
  .readdirSync(modelsDir)
  .filter(file => file.indexOf('.') !== 0 && file.indexOf('.map') === -1)
  // import model files and save model names
  .forEach((file) => {
    const model = sequelize.import(path.join(modelsDir, file));
    logger.info(`Initializing Model ${model.name}...`);
    db[model.name] = model;
  });

// calling all the associate function, in order to make the association between the models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Synchronizing any model changes with database.
sequelize.sync()
  .then(() => {
    logger.info('Database synchronized');
  })
  .catch((err) => {
    logger.error(err);
  });

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend(
  {
    sequelize,
    Sequelize,
  },
  db,
);
