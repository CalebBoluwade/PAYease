// INITIALIZE SERVER
import express, { Application, Request, Response } from "express";
const app: Application = express();
import helmet from "helmet";
import https from "https";
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    // preflightContinue: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);
// app.use(cookieParser());

import path from "path";
import fs from "fs";
import fileUpload from "express-fileupload";
app.use(fileUpload());

const serverOptions = {
  key: fs.readFileSync(path.join(__dirname, "../Certificates", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../Certificates", "cert.pem")),
  code: fs.readFileSync(path.join(__dirname, "../Certificates", "csr.pem")),
  sessionTimeout: 3000,
};
const httpsServer = https.createServer(serverOptions, app);
require("dotenv").config();

import Auth from "../Middleware/Auth";

import webSocket from "ws";
// const wsServer = new webSocket.Server({ server });

// import soap from "soap";
import bodyParser from "body-parser";

// Routes
import Login from "./Routes/Users/Login";
import Register from "./Routes/Users/Register";
import InitPayrollwFile from "./Routes/PAYROLL/InitPayrollwFile";
import InitPayrollfrmDB from "./Routes/PAYROLL/InitPayrollfromDB";
import GenerateOTP from "./Routes/OTP/GenerateOTP";
import ValidateOTP from "./Routes/OTP/ValidateOTP";

app.use(Auth);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);

// const date = new Date();

import UpdatePassword from "./Routes/Users/UpdatePassword";
import Airtime from "./Routes/Utils/Airtime";
import Requery from "./Routes/Utils/Requery";
import Admin from "./Routes/Users/AdminLogin";
import InitPayrollProceed from "./Routes/PAYROLL/InitPayrollProceed";

// console.log(process.cwd());

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

// app.use(express.static(path.join(__dirname, "../Public/build")));

// app.use("/payserv/*", (req, res) => {
//   // logger.info(req);
//   res.sendFile(path.join(__dirname, "../Public/build", "index.html"));
// });

//  transactionTypes: BULK_FT || SINGLE_FT || Monthly_FT ||
const transactionType: string = "BULK_FT";
const companyName: string = "Serve Nigeria Limited";

// IMITIATE CUSTOMER BALANCE REQUEST
app.get("/api/v1/customer", (req: Request, res: Response) => {
  res.json({
    customerID: "122123212",
    accountNumber: "1234567890",
    BVN: "1323190230",
    availableBalance: "34000000",
    status: "Active",
  });
});

app.get("/api/v1/getUploadTemplate", (req: Request, res: Response) => {});

app.use("/api/v1/init-payroll/db", InitPayrollfrmDB);

app.post("/api/v1/init-payroll/file", InitPayrollwFile);

app.post("/api/v1/init-payroll/proceed", InitPayrollProceed);

// USER ROUTES
app.get("/api/v1/login", (req: Request, res: Response) => {
  if (req.session) {
    res.send({ loggedIn: true, user: req.session });
  } else {
    res.send({ loggedIn: false });
  }
});
app.post("/api/v1/login", Login);

app.post("/api/v1/admin-login", Admin);

app.post("/api/v1/onboarding", Register);

app.put("/api/v1/passwordUpdate", UpdatePassword);

// OTP
app.get("/api/v1/generate-otp", GenerateOTP);

app.post("/api/v1/validate-otp", ValidateOTP);

// AIRTIME
app.post("/api/v1/airtime", Airtime);

app.get("/api/v1/txn-requery", Requery);

httpsServer.listen(process.env.PORT, () => {
  logger.info(
    "API Services are available at PORT: " + process.env.PORT || 8080
  );
});
