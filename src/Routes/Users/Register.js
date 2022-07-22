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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const SqlClient_1 = __importDefault(require("../../../Config/SqlClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger = require("pino")();
exports.default = app.post("/api/v1/onboarding", (req, res) => {
    try {
        let { name, email, password, country, currencyDenom, phoneNo, Bank, NUBAN_AccountNo, } = req.body;
        Bank = "Keystone";
        NUBAN_AccountNo = "1012391029";
        const date = new Date();
        // console.log(req.body, Bank, NUBAN_AccountNo);
        bcrypt_1.default.hash(password, 10, (hash) => __awaiter(void 0, void 0, void 0, function* () {
            yield SqlClient_1.default
                .execute(`INSERT INTO companydb.companymaster (companyName, companyEmail, companyPassword, country, countryDenom, phoneNo, Bank, NUBAN_AccountNo, dateCreated) VALUES ('${name}',
            '${email}',
            '${hash}',
            '${country}',
            '${currencyDenom}',
            '${phoneNo}',
            '${Bank}',
            '${NUBAN_AccountNo}',
            '${date.toString()}');`)
                .then(() => __awaiter(void 0, void 0, void 0, function* () {
                // let name = name;
                // let email = newUser.companyEmail;
                // await RegisteredNew(email, name);
                res.status(201).json({
                    state: true,
                    message: "Account Created Successfully!",
                });
            }))
                .catch((error) => {
                console.log(error);
                res.status(400).json({
                    state: false,
                    message: error,
                });
            });
        }));
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
