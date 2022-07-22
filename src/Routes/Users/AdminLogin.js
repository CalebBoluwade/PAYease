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
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
exports.default = app.post("/api/v1/admin-login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        // email = "jb_formular@example.com";
        console.log(req.body);
        yield SqlClient_1.default
            .execute(`SELECT * FROM companydb.companymaster WHERE companyEmail = '${email}'`)
            .then(([existingUser, _]) => {
            if (!existingUser) {
                console.log(existingUser);
                res.status(404).send("No User Found with this email");
            }
            if (existingUser) {
                // console.log(existingUser);
                bcrypt_1.default.compare(password, existingUser[0].companyPassword, (err) => {
                    if (err) {
                        res.status(403).send({
                            state: false,
                            message: "Login Failed",
                        });
                        console.log(password, existingUser.companyPassword);
                    }
                    res.status(200).send({
                        state: true,
                        message: "Login Success",
                        userData: existingUser[0],
                    });
                    let name = existingUser[0].companyName;
                    // let email = existingUser.companyEmail;
                    // LoginNotification(email, name);
                    // res.status(403).send({
                    //   state: false,
                    //   message: "Login Failed! Incorrect Password",
                    // });
                });
            }
        });
        // const token = jwt.sign(
        //   { user_id: User._id, email },
        //   process.env.TOKEN_KEY,
        //   {
        //     expiresIn: "1h",
        //   }
        // );
        // User.token = token;
    }
    catch (e) {
        console.log(e);
    }
}));
