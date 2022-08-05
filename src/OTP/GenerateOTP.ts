import express, { Application, Request, Response } from "express";
const app: Application = express();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);
import path from "path";

// try {
//   import SqlClient from "../../Config/SqlClient";
// } catch {
//   import SqlClient from "../../Config/SqlClient";
// }

const date = new Date();
import fs from "fs";
// OTP
let OTP: string;

let filePath = path.join(__dirname, "OTPFiles", `${Date.now()}.txt`);
let email = "calebb.jnr@gmail.com";

const generateOTP = async () => {
  let randomNum: any = Math.random().toFixed(6).substring(2);
  OTP = Math.floor(randomNum).toString();
  logger.info("Writing OTP to file");
  logger.info("Writing OTP to dB");

  fs.writeFile(filePath, OTP, (err) => {
    if (err) {
      logger.error(err);
    }

    logger.info(
      "OTP Generated. OTP has been sent successfully written to file and sent to " +
      email
    );

    // SqlClient.query(`INSERT INTO dev_db.otp_request VALUES (?,?,?,?) ['ENDUSER', '1', ${date.toDateString()}]`, OTP)

    try {
      setTimeout(() => {
        fs.unlink(path.join(__dirname, "OTPFiles", "test2.txt"), (err) => {
          if (err) {
            logger.error(err);
          }
        });
      }, 50000);
    } catch (error) {
      logger.error(err);
    }
  })
  // return OTP;
};

export default app.get("/api/v1/generate-otp", (req: Request, res: Response) => {
  // console.log(req.session);
  // req.session.isAuth = true;

  let randomNum: any = Math.random().toFixed(6).substring(2);
  OTP = Math.floor(randomNum).toString();
  logger.info("Writing OTP to file");
  logger.info("Writing OTP to dB");

  fs.writeFile(filePath, OTP, (err) => {
    if (err) {
      logger.error(err);
    }

    // SqlClient.execute(`INSERT INTO dev_db.otp_request VALUES (?,?,?,?) ['ENDUSER', '1', ${date.toDateString()}]`, (err: Error, result: any) => {
    //   if (err) {
    //     logger.error(err);
    //   }

    //   logger.info(result);
    // })

    logger.info(
      "OTP Generated. OTP has been sent successfully written to file and sent to " +
      email
    );

    try {
      setTimeout(() => {
        fs.unlink(path.join(__dirname, "OTPFiles", "test2.txt"), (err) => {
          if (err) {
            logger.error(err);
          }
        });
      }, 50000);
    } catch (error) {
      logger.error(err);
    }
  })
  // return OTP;

  // let name = "Caleb";

  // OTPMail(email, name, OTP, assistantProfile).then((err, sentMail) => {
  //   if (err) {
  //     res.status(503).send("Server Down");
  //   }
  //   if (sentMail) {
  //     res.status(200).send("Mail Sent Sucessfully");
  //   }
  // });

  // generateOTP()

  res.status(200).send({
    message:
      "OTP Generated. OTP has been sent successfully written to file and sent to " +
      email +
      ".",
    expiresIn: "10s",
  });
})

