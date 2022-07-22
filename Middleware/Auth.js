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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const userName = "APIv1User";
const password = "APIv1Password";
const user = process.env.user;
const Password = process.env.password;
const Auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.default = Auth;
