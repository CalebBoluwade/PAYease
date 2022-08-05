"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
const body_parser_1 = __importDefault(require("body-parser"));
body_parser_1.default.urlencoded({ extended: true });
body_parser_1.default.json();
const transportOptions = {
    secureConnection: false,
    pool: true,
    host: "smtp.mailtrap.io",
    port: 587,
    requireTLS: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    logger: true
};
const InitPayrollMail = async (totalAmount, paymentSchedule) => {
    try {
        logger.info(totalAmount);
        const transport = nodemailer_1.default.createTransport(transportOptions);
        const info = await transport.sendMail({
            from: 'Admin',
            to: "test@example.com",
            subject: "Hello from node",
            text: "Hello world?",
            html: "<strong>Hello world?</strong>",
            // headers: { Authorization: process.env.MAILTRAP_API_KEY },
        });
    }
    catch (error) {
        logger.error(error);
    }
    // console.log("Message sent: %s", info.response);
};
exports.default = InitPayrollMail;
