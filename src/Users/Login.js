"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
// app.use(
//   session({
//     // key: "userId",
//     secret: "testSecret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 60 * 60 * 24,
//     },
//   })
// );
exports.default = app.post("/api/v1/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        logger.info(req.session);
        // email = "jb_formular@example.com";
        logger.log(req.body);
        // await dB
        //   .execute(
        //     `SELECT * FROM companydb.companymaster WHERE companyEmail = '${email}'`
        //   )
        //   .then(([existingUser, _]: any) => {
        //     if (!existingUser) {
        //       console.log(existingUser);
        //       res.status(404).send("No User Found with this email");
        //     }
        //     if (existingUser) {
        //       // console.log(existingUser);
        //       bcrypt.compare(
        //         password,
        //         existingUser[0].companyPassword,
        //         (err: any) => {
        //           if (err) {
        //             res.status(403).send({
        //               state: false,
        //               message: "Login Failed",
        //             });
        //             console.log(password, existingUser.companyPassword);
        //           }
        //           req.session = existingUser[0];
        //           // req.session.id = existingUser[0];
        //           logger.info(req.session, req.session.id);
        //           res.status(200).send({
        //             state: true,
        //             message: "Login Success",
        //             userData: existingUser[0],
        //           });
        //           let name = existingUser[0].companyName;
        //           // let email = existingUser.companyEmail;
        //           // LoginNotification(email, name);
        //           // res.status(403).send({
        //           //   state: false,
        //           //   message: "Login Failed! Incorrect Password",
        //           // });
        //         }
        //       );
        //     }
        //   });
        // const token = jwt.sign(
        //   { user_id: User._id, email },
        //   process.env.TOKEN_KEY,
        //   {
        //     expiresIn: "1h",
        //   }
        // );
        // User.token = token;
    }
    catch (e) {
        console.log(e);
    }
});
