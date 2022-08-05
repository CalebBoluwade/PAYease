import express, { Application, Request, Response } from "express";
const app: Application = express();
const logger = require("pino")();
import path from "path";

import fs from "fs";

const ws = fs.createWriteStream("./test.txt");

export default app.post(
  "/api/v1/new-receipt",
  (req: Request, res: Response) => {
    const rs = fs.createReadStream(req.body.file, { encoding: "utf8" });

    rs.pipe(ws);
  }
);
