// INITIALIZE SERVER
import express, { Application, Request, Response, NextFunction } from "express";
const app: Application = express();
import bodyParser from "body-parser";
import helmet from "helmet";
import https from "https";
import cors from "cors";
import cookieParser from "cookie-parser";
const proxy = require("express-http-proxy");

app.use(
  cors({
    // preflightContinue: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());

// app.use("/api/v1/init-payroll", proxy("https://localhost:6969"));
app.use("/users", proxy("https://localhost:6966"));
app.use("/utils", proxy("https://localhost:6966"));

import path from "path";
import fs from "fs";
import fileUpload from "express-fileupload";
app.use(fileUpload());

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, "../Certificates", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../Certificates", "cert.pem")),
  code: fs.readFileSync(path.join(__dirname, "../Certificates", "csr.pem")),
  sessionTimeout: 5000,
};
const httpsServer = https.createServer(serverOptions, app);
import * as dotenv from "dotenv";
dotenv.config();

import Auth from "../Middleware/Auth";

import webSocket from "ws";
// const wsServer = new webSocket.Server({ server });

// import soap from "soap";
// Routes
import Login from "./Users/Login";
import Register from "./Users/Register";
import InitPayrollwFile from "./PAYROLL/InitPayrollwFile";
import InitPayrollfrmDB from "./PAYROLL/InitPayrollfromDB";
import GenerateOTP from "./OTP/GenerateOTP";
import ValidateOTP from "./OTP/ValidateOTP";

// app.use(Auth);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(helmet());
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);

import UpdatePassword from "./Users/UpdatePassword";
import Airtime from "./Utils/Airtime";
import Requery from "./Utils/Requery";
import Admin from "./Users/AdminLogin";
import InitPayrollProceed from "./PAYROLL/InitPayrollProceed";

// wsServer.on("connection", (ws) => {
//   ws.send("New Client Connection");
//   // console.log(connection)
//   ws.on("message", (data) => {
//     wsServer.clients.forEach((client) => {
//       if (client.readyState === webSocket.OPEN) {
//         client.send(data);
//       }
//     });
//   });
// });

app.use(express.static(path.join(__dirname, "../Public/build")));

app.use("/payserv", (req, res) => {
  // logger.info(req);
  res.sendFile(path.join(__dirname, "../Public/build", "index.html"));
});

//  transactionTypes: BULK_FT || SINGLE_FT || Monthly_FT ||
const transactionType: string = "BULK_FT";
const customerName: string = "Serve Nigeria Limited";
("Big Energy Limited");

// IMITIATE CUSTOMER BALANCE REQUEST
app.get("/api/v1/customer", (req: Request, res: Response) => {
  res.send([
    {
      customerID: "122123212",
      customerName: customerName,
      accountNumber: "1234567890",
      BVN: "1323190230",
      availableBalance: "34000000",
      status: "Active",
    },
  ]);
});

app.get("/api/v1/getUploadTemplate", (req: Request, res: Response) => {
  res.send("dhfg");
});

app.use("/api/v1/init-payroll/db", Auth, InitPayrollfrmDB);

app.post("/api/v1/init-payroll/file", InitPayrollwFile);

app.post("/api/v1/init-payroll/proceed", Auth, InitPayrollProceed);

// USER ROUTES
app.get("/api/v1/login", (req: Request, res: Response) => {
  if (req.session) {
    res.send({ loggedIn: true, user: req.session });
  } else {
    res.send({ loggedIn: false });
  }
});
app.post("/api/v1/users/login", Login);

app.post("/api/v1/users/admin-login", Admin);

app.post("/api/v1/users/onboarding", Register);

app.put("/api/v1/users/passwordUpdate", UpdatePassword);

// OTP
app.get("/api/v1/generate-otp", GenerateOTP);

app.post("/api/v1/validate-otp", ValidateOTP);

// AIRTIME
app.post("/api/v1/airtime", Airtime);

app.get("/api/v1/txn-requery", Requery);

httpsServer
  .listen(process.env.PORT, () => {
    logger.info(`API Services are available on PORT: ${process.env.PORT}`);
    logger.info(`API Gateway is listening on https Port ${3002}`);
  })
  .on("error", (error) => {
    logger.error(error);
    process.exit();
  });
