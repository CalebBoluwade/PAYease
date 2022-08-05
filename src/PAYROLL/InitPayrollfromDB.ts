import express, { Application, Request, Response } from "express";
const app: Application = express();
const logger = require("pino")();
// import path from "path";
import dB from "../../Config/SqlClient";

const companyID = 1;

export default app.post(
  "/api/v1/init-payroll/db",
  (req: Request, res: Response) => {
    dB.query(
      `SELECT * FROM payrolldb.EmployeeData WHERE companyID = ${companyID}`
    ).then(([results, _]: Array<object>) => {
      if (results) {
        res.send(results);
      }
    });
  }
);
