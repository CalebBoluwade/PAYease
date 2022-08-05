import express, { Application, Request, Response } from "express";
const app: Application = express();
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

app.use('/users', proxy('https://localhost:6966'));
app.use('/payroll', proxy('https://localhost:6966'));
app.use('/utils', proxy('https://localhost:6966'));

app.listen(3002, () => {
    console.log(`API Gateway is listening on https Port ${3002}`);
});