import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
// const nodemailer = require("nodemailer");

const RegisterMailer = async () => {
    const transport = nodemailer.createTransport({
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

}

export default RegisterMailer;