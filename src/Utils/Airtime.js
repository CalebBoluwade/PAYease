"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const https_1 = __importDefault(require("https"));
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
const axios_1 = __importDefault(require("axios"));
const date = new Date();
exports.default = app.post("/api/v1/airtime", async (req, res) => {
    let request_id = req.body.request_id;
    let serviceID = req.body.serviceID;
    let amount = req.body.amount;
    let phoneNo = req.body.phoneNo;
    const companySName = "SNL";
    const serviceType = "Airtime";
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let Year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let Month = new Intl.DateTimeFormat("en", { month: "numeric" }).format(d);
    let Day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    let Hour = new Intl.DateTimeFormat("en", { hour: "numeric" }).format(d);
    let Min = new Intl.DateTimeFormat("en", { minute: "2-digit" }).format(date.getMinutes());
    // console.log(`${da}-${mo}-${ye}-${hr}-${min}`);
    request_id = Year + Month + Day + Hour + Min;
    const xRequest_id = "202207150230qwerty";
    console.log(serviceID, amount, phoneNo);
    try {
        await axios_1.default
            .post("https://sandbox.vtpass.com/api/pay", {
            headers: {
                Accept: "application/json",
                authorization: "calebb.jnr@gmail.com:qwertyuiop",
                httpsAgent: new https_1.default.Agent({ keepAlive: true }),
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
    }
    catch (error) {
        logger.error(error);
        res.send(error);
    }
});
