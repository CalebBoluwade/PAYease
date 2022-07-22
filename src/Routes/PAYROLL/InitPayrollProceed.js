"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("dotenv").config();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
const path_1 = __importDefault(require("path"));
const XLSX = __importStar(require("xlsx"));
const transactionType = "BULK_FT";
const companyName = "Serve Nigeria Limited";
const companyID = 1;
const companySName = "SNL";
const xlsx = /\.xlsx/gi;
exports.default = app.post("/api/v1/init-payroll/proceed", (req, res) => {
    let { sessionID } = req.body;
    let Trans_fee = 145;
    let VAT = 7.5;
    let totalAmount = 0;
    // if (xlsx.test()) {
    let workbook = XLSX.readFile(path_1.default.join(`${__dirname}/Uploads/PAYMENT_SCHEDULE_${sessionID}`));
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const paymentSchedule = XLSX.utils.sheet_to_json(worksheet);
    const Fees = Trans_fee * paymentSchedule.length;
    // const testNoOfColumns = XLSX.utils.
    for (let i = 2; i < paymentSchedule.length + 2; i++) {
        const SN = worksheet[`A${i}`].v;
        const employeeName = worksheet[`B${i}`].v;
        const employeeEmail = worksheet[`C${i}`].v;
        const accountNum = worksheet[`E${i}`].v.toString();
        const beneficialAccount = worksheet[`F${i}`].v;
        const amount = worksheet[`D${i}`].v;
        totalAmount += amount;
    }
    const processPay = () => {
        // Writing the transaction to the main transaction table
        logger.info("Writing transaction to the main transaction table");
        // await dB
        //   .query(
        //     `INSERT INTO payrolldb.transactionMaster (companyName, companyID, sessionID, transactionType, totalAmount, Fee, transactionStatus, transactionCount, dateInitiated) VALUES (?,?,?,?,?,?,?,?)['${companyName}','${companyID}', '${sessionID}','${transactionType}', '${totalAmount}', '${Fees}', 'INITIALIZED', '${
        //       paymentSchedule.length
        //     }', '${date.toString()}']`,
        //     (err: any) => {
        //       logger.debug(err);
        //     }
        //   )
        //   .then(() => {
        //     logger.info({
        //       message: "Payment Schedule Received Successfully",
        //       sessionID: sessionID,
        //     });
        //   });
        // Writing the transaction details to the transactions table
        logger.info("Writing transaction details to the transactions table");
        paymentSchedule.forEach((payOut) => {
            console.log("Payment Schedule", payOut);
            //   await dB.query(
            //     `INSERT INTO payrolldb.transactionDetails (companyName, companySName, companyID, transactionType, sessionID, beneficiaryName, accountNumber,beneficiaryAccount, transactionAmount, status, referenceNo, dateAdded) VALUES (?,?,?,?,?,?,?,?)['${companyName}','${companySName}','${companyID}','${transactionType}','${sessionID}','${employeeName}','${accountNum}','${beneficialAccount}','${amount}','${"INITIALIZED"}','${
            //       companySName + Math.floor(Math.random() * 1000) + date.toString()
            //     }', '${date.toLocaleString()}']`
            //   );
            // }
        });
    };
    res.send({
        message: "Payment Schedule has been successfully processed.",
        sessionID: sessionID,
        // totalAmount: totalAmount + Trans_fee * paymentSchedule.length,
        // Fees: Fees,
        // VAT: VAT,
        // VATFees: (VAT / 100) * totalAmount,
    });
});
