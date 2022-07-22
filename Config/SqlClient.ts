const sql = require("mssql");
require("dotenv").config();
// console.log(process.env);

const sqlConfig = {
  user: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PWD,
  database: process.env.LOCAL_DB_NAME,
  server: "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
const dB: any = async () => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    // const result = await sql.query`select * from mytable where id = ${value}`;
    // console.dir(result);
  } catch (err) {
    // ... error checks
    console.log(err);
  }
};

export default dB;
