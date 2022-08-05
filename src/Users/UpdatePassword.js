"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const SqlClient_1 = __importDefault(require("../../../Config/SqlClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger = require("pino")();
// require("dotenv").config();
const companyID = 1;
const saltRounds = process.env.saltRounds;
exports.default = app.post("/api/v1/passwordUpdate", async (req, res) => {
    let { old_password, passwordUpdate } = req.body;
    let [existingPassword, _] = await SqlClient_1.default
        .query(`SELECT TOP 1 [companyPassword] FROM payrolldb.companyData WHERE companyID = '${companyID}`, (err) => {
        if (err) {
            logger.error(err);
        }
    })
        .then(() => {
        // Company old and new password
        bcrypt_1.default.compare(old_password, existingPassword, (err, result) => {
            if (err) {
                logger.error(err);
            }
            //   Encrypt the new password
            bcrypt_1.default.hash(passwordUpdate, saltRounds, async (newHash) => {
                SqlClient_1.default.query(`UPDATE payrolldb.companyData SET companyPassword = ${newHash} WHERE companyID = ${companyID}`);
            });
        });
    });
});
