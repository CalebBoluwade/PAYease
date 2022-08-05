"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const logger = require("pino")();
const SqlClient_1 = __importDefault(require("../../../Config/SqlClient"));
const companyID = 1;
exports.default = app.post("/api/v1/init-payroll/db", (req, res) => {
    SqlClient_1.default.query(`SELECT * FROM payrolldb.EmployeeData WHERE companyID = ${companyID}`).then(([results, _]) => {
        if (results) {
            res.send(results);
        }
    });
});
