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
exports.default = app.post("/api/v1/validate-otp", async (req, res) => {
    let userOTP = req.body.OTP;
    // console.log(userOTP, OTP);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, "OTPFiles", "test2.txt"))) {
        await fs_1.default.readFile(path_1.default.join(__dirname, "OTPFiles", "test2.txt"), "utf8", (err, data) => {
            if (err) {
                logger.error(err);
            }
            if (data) {
                OTP = data.toString();
                if (userOTP === OTP) {
                    logger.info("OTP CONFIRMED, ACCESS GRANTED!");
                    res.status(200).send({
                        state: true,
                        message: "OTP CONFIRMED, ACCESS GRANTED!",
                    });
                    // res.render("http://localhost:3000/receipt");
                    // console.log(userOTP, OTP);
                }
                if (userOTP !== OTP) {
                    logger.info("OTP MISMATCH");
                    res.status(401).send({ state: false, message: "OTP MISMATCH" });
                    // console.log(userOTP, OTP);
                }
            }
        });
    }
    else {
        res
            .status(401)
            .send({ state: false, message: "Invalid OTP or OTP Expired!" });
    }
});
