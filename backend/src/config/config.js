const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),

    SMTP_SERVICE: Joi.string().description("service"),
    SMTP_PORT: Joi.number().description("port to connect to the service"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description("the from field in the emails sent by the app"),

    CLOUDINARY_API_KEY: Joi.string().description("cloudinary api key"),
    CLOUDINARY_API_SECRET: Joi.string().description("cloudinary api secret key"),
    CLOUDINARY_CLOUD_NAME: Joi.string().description("cloudinary name"),

    PAYPAL_CLIENT_ID: Joi.string().description("paypal client id"),
    PAYPAL_CLIENT_SECRET: Joi.string().description("paypal client secret"),

    PG_USER: Joi.string().description("PostgreSQL user"),
    PG_PASSWORD: Joi.string().description("PostgreSQL password"),
    PG_HOST: Joi.string().description("PostgreSQL host"),
    PG_PORT: Joi.number().default(5432).description("PostgreSQL port"),
    PG_DATABASE: Joi.string().description("PostgreSQL database name"),
  })
  .unknown();

const { value: envVars } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

module.exports = {
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  email: {
    smtp: {
      service: envVars.SMTP_SERVICE,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
  },
  cloudinary: {
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_secret: envVars.CLOUDINARY_API_SECRET,
    api_key: envVars.CLOUDINARY_API_KEY,
  },
  paypal: {
    client_id: envVars.PAYPAL_CLIENT_ID,
    client_secret: envVars.PAYPAL_CLIENT_SECRET,
  },
  pg: {
    user: envVars.PG_USER,
    password: envVars.PG_PASSWORD,
    host: envVars.PG_HOST,
    port: envVars.PG_PORT,
    database: envVars.PG_DATABASE,
  },
};
