import express, { Application, Request, Response } from "express";
const app: Application = express();
import dB from "../../../Config/SqlClient";
import bcrypt from "bcrypt";
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);

export default app.post(
  "/api/v1/admin-login",
  async (req: Request, res: Response) => {
    try {
      let { email, password } = req.body;

      // email = "jb_formular@example.com";

      console.log(req.body);

      await dB
        .execute(
          `SELECT * FROM companydb.companymaster WHERE companyEmail = '${email}'`
        )
        .then(([existingUser, _]: any) => {
          if (!existingUser) {
            console.log(existingUser);
            res.status(404).send("No User Found with this email");
          }

          if (existingUser) {
            // console.log(existingUser);
            bcrypt.compare(
              password,
              existingUser[0].companyPassword,
              (err: any) => {
                if (err) {
                  res.status(403).send({
                    state: false,
                    message: "Login Failed",
                  });
                  console.log(password, existingUser.companyPassword);
                }

                res.status(200).send({
                  state: true,
                  message: "Login Success",
                  userData: existingUser[0],
                });

                let name = existingUser[0].companyName;
                // let email = existingUser.companyEmail;
                // LoginNotification(email, name);

                // res.status(403).send({
                //   state: false,
                //   message: "Login Failed! Incorrect Password",
                // });
              }
            );
          }
        });

      // const token = jwt.sign(
      //   { user_id: User._id, email },
      //   process.env.TOKEN_KEY,
      //   {
      //     expiresIn: "1h",
      //   }
      // );
      // User.token = token;
    } catch (e) {
      console.log(e);
    }
  }
);
