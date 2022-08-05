"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const logger = require("pino")();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// OTP
let OTP;
let filePath = path_1.default.join(__dirname, "OTPFiles", "test2.txt");
let email = "calebb.jnr@gmail.com";
const generateOTP = () => {
    let randomNum = Math.random().toFixed(6).substring(2);
    OTP = Math.floor(randomNum).toString();
    logger.info("Writing OTP to file");
    logger.info("Writing OTP to dB");
    fs_1.default.writeFile(filePath, OTP, (err) => {
        if (err) {
            logger.error(err);
        }
        logger.info("OTP Generated. OTP has been sent successfully written to file and sent to " +
            email);
        try {
            setTimeout(() => {
                fs_1.default.unlink(path_1.default.join(__dirname, "OTPFiles", "test2.txt"), (err) => {
                    if (err) {
                        logger.error(err);
                    }
                });
            }, 50000);
        }
        catch (error) {
            logger.error(err);
        }
    });
    // return OTP;
};
exports.default = app.get("/api/v1/generate-otp", (req, res) => {
    // console.log(req.session);
    // req.session.isAuth = true;
    // let name = "Caleb";
    // OTPMail(email, name, OTP, assistantProfile).then((err, sentMail) => {
    //   if (err) {
    //     res.status(503).send("Server Down");
    //   }
    //   if (sentMail) {
    //     res.status(200).send("Mail Sent Sucessfully");
    //   }
    // });
    generateOTP();
    res.status(200).send({
        message: "OTP Generated. OTP has been sent successfully written to file and sent to " +
            email +
            ".",
        expiresIn: "10s",
    });
});
