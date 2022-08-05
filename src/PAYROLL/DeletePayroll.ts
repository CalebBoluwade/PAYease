import express, { Application, Request, Response } from "express";
const app: Application = express();
import * as dotenv from 'dotenv';
dotenv.config();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
import path from "path";
import fs from "fs";

export default app.delete(
    "/api/v1/payroll/close",
    async (req: Request, res: Response) => {

    })