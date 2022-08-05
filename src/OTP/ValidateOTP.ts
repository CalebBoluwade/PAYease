import express, { Application, Request, Response } from "express";
const app: Application = express();
const logger = require("pino")();
import path from "path";

import fs from "fs";
// OTP
let OTP: any;

export default app.post(
  "/api/v1/validate-otp",
  async (req: Request, res: Response) => {
    let userOTP: string = req.body.OTP;
    // console.log(userOTP, OTP);

    if (fs.existsSync(path.join(__dirname, "OTPFiles", "test2.txt"))) {
      await fs.readFile(
        path.join(__dirname, "OTPFiles", "test2.txt"),
        "utf8",
        (err, data) => {
          if (err) {
            logger.error(err);
          }
          if (data) {
            OTP = data.toString();

            if (userOTP === OTP) {
              logger.info("OTP CONFIRMED, ACCESS GRANTED!");
              res.status(200).send({
                state: true,
                message: "OTP CONFIRMED, ACCESS GRANTED!",
              });
              // res.render("http://localhost:3000/receipt");

              // console.log(userOTP, OTP);
            }

            if (userOTP !== OTP) {
              logger.info("OTP MISMATCH");
              res.status(401).send({ state: false, message: "OTP MISMATCH" });

              // console.log(userOTP, OTP);
            }
          }
        }
      );
    } else {
      res
        .status(401)
        .send({ state: false, message: "Invalid OTP or OTP Expired!" });
    }
  }
);
