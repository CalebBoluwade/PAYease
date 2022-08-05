"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const userName = "APIv1User";
const password = "APIv1Password";
const user = process.env.user;
const Password = process.env.password;
const Auth = async (req, res, next) => {
    if (req.headers.authorization) {
        if (req.headers.authorization === user + ":" + Password) {
            next();
        }
        else {
            res.status(401);
            res.end("UNAUTHORIZED");
        }
    }
    else {
        res.status(401);
        res.end("UNAUTHORIZED");
    }
};
exports.default = Auth;
