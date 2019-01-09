const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  SQL_HOST: Joi.string().required()
    .description('SQL DB host url'),
  SQL_DB: Joi.string().required()
    .description('SQL DB name'),
  SQL_USER: Joi.string().required()
    .description('SQL DB user'),
  SQL_PASSWORD: Joi.string().required()
    .description('SQL DB password'),
  SQL_PORT: Joi.number()
    .default(3306)
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  sql: {
    host: envVars.SQL_HOST,
    port: envVars.SQL_PORT,
    user: envVars.SQL_USER,
    password: envVars.SQL_PASSWORD,
    db: envVars.SQL_DB,
  }
};

module.exports = config;
