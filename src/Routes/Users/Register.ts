import express, { Application, Request, Response } from "express";
const app: Application = express();
import dB from "../../../Config/SqlClient";
import bcrypt from "bcrypt";
const logger = require("pino")();

export default app.post("/api/v1/onboarding", (req: Request, res: Response) => {
  try {
    let {
      name,
      email,
      password,
      country,
      currencyDenom,
      phoneNo,
      Bank,
      NUBAN_AccountNo,
    } = req.body;

    Bank = "Keystone";
    NUBAN_AccountNo = "1012391029";
    const date = new Date();

    // console.log(req.body, Bank, NUBAN_AccountNo);

    bcrypt.hash(password, 10, async (hash) => {
      await dB
        .execute(
          `INSERT INTO companydb.companymaster (companyName, companyEmail, companyPassword, country, countryDenom, phoneNo, Bank, NUBAN_AccountNo, dateCreated) VALUES ('${name}',
            '${email}',
            '${hash}',
            '${country}',
            '${currencyDenom}',
            '${phoneNo}',
            '${Bank}',
            '${NUBAN_AccountNo}',
            '${date.toString()}');`
        )
        .then(async () => {
          // let name = name;
          // let email = newUser.companyEmail;

          // await RegisteredNew(email, name);
          res.status(201).json({
            state: true,
            message: "Account Created Successfully!",
          });
        })
        .catch((error: any) => {
          console.log(error);

          res.status(400).json({
            state: false,
            message: error,
          });
        });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
