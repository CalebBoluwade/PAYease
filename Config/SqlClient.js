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
const sql = require("mssql");
require("dotenv").config();
// console.log(process.env);
const sqlConfig = {
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PWD,
    database: process.env.LOCAL_DB_NAME,
    server: "localhost",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: false,
        trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
};
const dB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        yield sql.connect(sqlConfig);
        // const result = await sql.query`select * from mytable where id = ${value}`;
        // console.dir(result);
    }
    catch (err) {
        // ... error checks
        console.log(err);
    }
});
exports.default = dB;
