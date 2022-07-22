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
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
const axios_1 = __importDefault(require("axios"));
const date = new Date();
exports.default = app.get("/api/v1/txn-requery", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let request_id = req.query.transactionId;
    try {
        yield axios_1.default
            .post("https://sandbox.vtpass.com/api/requery", {
            headers: {
                Accept: "application/json",
                authorization: "calebb.jnr@gmail.com:qwertyuiop",
            },
            body: {
                request_id: request_id,
            },
        })
            .then((response) => {
            res.send(JSON.stringify(response));
        });
    }
    catch (error) {
        logger.error(error);
        res.send(error);
    }
}));
