const config = require('./config/config');
const app = require('./config/express');
const db = require('./config/sequelize'); // eslint-disable-line

const debug = require('debug')('express-postgresql-sequelize-es6-rest-api:index'); // eslint-disable-line


if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
