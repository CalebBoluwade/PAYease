"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.default = app.post("/api/v1/passwordUpdate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { old_password, passwordUpdate } = req.body;
    let [existingPassword, _] = yield SqlClient_1.default
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
            bcrypt_1.default.hash(passwordUpdate, saltRounds, (newHash) => __awaiter(void 0, void 0, void 0, function* () {
                SqlClient_1.default.query(`UPDATE payrolldb.companyData SET companyPassword = ${newHash} WHERE companyID = ${companyID}`);
            }));
        });
    });
}));
