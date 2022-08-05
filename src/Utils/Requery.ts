import express, { Application, Request, Response } from "express";
const app: Application = express();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);
import path from "path";
import fs from "fs";
import dB from "../../Config/SqlClient";
import axios from "axios";

const date = new Date();

export default app.get(
  "/api/v1/txn-requery",
  async (req: Request, res: Response) => {
    let request_id: any = req.query.transactionId;

    try {
      await axios
        .post("https://sandbox.vtpass.com/api/requery", {
          headers: {
            Accept: "application/json",
            authorization: "calebb.jnr@gmail.com:qwertyuiop",
          },
          body: {
            request_id: request_id,
          },
        })
        .then((response) => {
          res.send(JSON.stringify(response));
        });
    } catch (error) {
      logger.error(error);
      res.send(error);
    }
  }
);
