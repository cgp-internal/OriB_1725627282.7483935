import path from "path";
import dotenv from "dotenv";
dotenv.config();

class BaseAppConfig {
  readonly routsPrefix = "/api/v1/";
  readonly doormanKey = "Door-Man-Key";
  readonly dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, //(root user no need password)
    port: 3306, // (also default)
  };
}

class DevAppConfig extends BaseAppConfig {
  readonly port = 4000; // default port is 3030
  readonly logFile = path.join(__dirname, "./../log.log");
  readonly imagesPath = path.join(__dirname, "./../assets/images/");
  readonly tokenSecreteKey = process.env.JWT_SECRETE;

  readonly dbConfig = {
    ...this.dbConfig,
    host: "localhost", // could be container name instead or external host as aws
    database: "oridb", // Replace with your MySQL database name
  };
}

class ProdAppConfig extends BaseAppConfig {
  readonly port = 443;
  readonly logFile = path.join(__dirname, "./../log.log");
  readonly imagesPath = path.join(__dirname, "./../assets/images/");
  readonly tokenSecreteKey = process.env.TokenSecretKey;

  readonly dbConfig = {
    ...this.dbConfig,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  };
}

export const appConfig = process.env.IS_PROD
  ? new ProdAppConfig()
  : new DevAppConfig();
