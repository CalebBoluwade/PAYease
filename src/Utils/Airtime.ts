import express, { Application, Request, Response } from "express";
const app: Application = express();
import https from "https";
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

export default app.post(
  "/api/v1/airtime",
  async (req: Request, res: Response) => {
    let request_id: string = req.body.request_id;
    let serviceID: string = req.body.serviceID;
    let amount: number = req.body.amount;
    let phoneNo: any = req.body.phoneNo;

    const companySName: string = "SNL";
    const serviceType: string = "Airtime";

    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let Year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let Month = new Intl.DateTimeFormat("en", { month: "numeric" }).format(d);
    let Day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    let Hour = new Intl.DateTimeFormat("en", { hour: "numeric" }).format(d);
    let Min = new Intl.DateTimeFormat("en", { minute: "2-digit" }).format(
      date.getMinutes()
    );
    // console.log(`${da}-${mo}-${ye}-${hr}-${min}`);
    request_id = Year + Month + Day + Hour + Min;
    const xRequest_id = "202207150230qwerty";

    console.log(serviceID, amount, phoneNo);

    try {
      await axios
        .post("https://sandbox.vtpass.com/api/pay", {
          headers: {
            Accept: "application/json",
            authorization: "calebb.jnr@gmail.com:qwertyuiop",
            httpsAgent: new https.Agent({ keepAlive: true }),
          },
          body: {
            request_id: xRequest_id,
            serviceID: req.body.serviceID,
            amount: req.body.amount,
            phone: req.body.phoneNo,
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
