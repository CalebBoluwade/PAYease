"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// const nodemailer = require("nodemailer");
const RegisterMailer = async () => {
    const transport = nodemailer_1.default.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false,
        requireTLS: true,
        auth: {
            user: "3afa145570e74a",
            pass: "520d812ee0d163"
        },
        logger: true
    });
    const info = await transport.sendMail({
        from: '"Sender Name" <from@example.net>',
        to: "to@example.com",
        subject: "Hello from node",
        text: "Hello world?",
        html: "<strong>Hello world?</strong>",
        headers: { 'x-myheader': 'test header' }
    });
    console.log("Message sent: %s", info.response);
};
exports.default = RegisterMailer;
