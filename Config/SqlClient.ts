const sql = require("mssql");
import * as dotenv from 'dotenv';
dotenv.config();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);

const sqlConfig = {
  user: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PWD,
  database: process.env.LOCAL_DB_NAME,
  port: Number(process.env.LOCAL_DB_PORT),
  server: "127.0.0.1",
  // pool: {
  //   max: 60,
  //   min: 0,
  //   idleTimeoutMillis: 30000,
  // },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
let dB;


async () => {
  try {
    dB = await sql.connect(sqlConfig)
    logger.info("Database connection established")
    const result = sql.query`select * from otp_request where id = ${1}`
    console.log(result)
  } catch (error) {
    logger.error(error)
  }
}


export default dB;