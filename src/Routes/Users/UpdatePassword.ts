import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
const app: Application = express();
import dB from "../../../Config/SqlClient";
import bcrypt from "bcrypt";
const logger = require("pino")();
// require("dotenv").config();

const companyID = 1;
const saltRounds: any = process.env.saltRounds;

export default app.post(
  "/api/v1/passwordUpdate",
  async (req: Request, res: Response) => {
    let { old_password, passwordUpdate } = req.body;

    let [existingPassword, _] = await dB
      .query(
        `SELECT TOP 1 [companyPassword] FROM payrolldb.companyData WHERE companyID = '${companyID}`,
        (err: any) => {
          if (err) {
            logger.error(err);
          }
        }
      )
      .then(() => {
        // Company old and new password
        bcrypt.compare(old_password, existingPassword, (err, result: any) => {
          if (err) {
            logger.error(err);
          }

          //   Encrypt the new password
          bcrypt.hash(passwordUpdate, saltRounds, async (newHash) => {
            dB.query(
              `UPDATE payrolldb.companyData SET companyPassword = ${newHash} WHERE companyID = ${companyID}`
            );
          });
        });
      });
  }
);
