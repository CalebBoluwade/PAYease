import nodemailer from "nodemailer";
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
import bodyParser from "body-parser";
bodyParser.urlencoded({ extended: true });
bodyParser.json();

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
}

const InitPayrollMail = async (totalAmount: string, paymentSchedule: Array<any>) => {
    try {
        logger.info(totalAmount);
        const transport = nodemailer.createTransport(transportOptions);

        const info = await transport.sendMail({
            from: 'Admin',
            to: "test@example.com",
            subject: "Hello from node",
            text: "Hello world?",
            html: "<strong>Hello world?</strong>",
            // headers: { Authorization: process.env.MAILTRAP_API_KEY },
        });

    } catch (error) {
        logger.error(error)
    }
    // console.log("Message sent: %s", info.response);

}

export default InitPayrollMail;