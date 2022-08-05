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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
const path_1 = __importDefault(require("path"));
// import fs from "fs";
const XLSX = __importStar(require("xlsx"));
const MoneyFC_1 = __importDefault(require("../../../Config/MoneyFC"));
const SqlClient_1 = __importDefault(require("../../../Config/SqlClient"));
const transactionType = "BULK_FT";
const companyName = "Serve Nigeria Limited";
const companyID = 1;
const companySName = "SNL";
const date = new Date();
const xlsx = /\.xlsx/gi;
exports.default = app.post("/api/v1/init-payroll/proceed", async (req, res) => {
    let Trans_fee = 145;
    let VAT = process.env.VAT;
    let totalAmount = 0;
    let { sessionID, customerBalance, valueDate } = req.body;
    // if (xlsx.test()) {
    try {
        ;
        let workbook = await XLSX.readFile(path_1.default.join(`${__dirname}/Uploads/PAYMENT_SCHEDULE_${sessionID}.xlsx`));
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
        // I Don't like dates
        let newValueDate = new Date(valueDate);
        let DateFormat = `${date.getDate()}`;
        let MonthFormat = `${date.getMonth() + 1}`;
        console.log(MonthFormat, MonthFormat.length, "0" + `${date.getDate() + 1}`);
        let todayDate = `${date.getFullYear()}-${MonthFormat.length == 1 ? "0" + `${date.getMonth() + 1}` : date.getMonth() + 1}-${DateFormat.length == 1 ? "0" + `${date.getDate()}` : date.getDate()}`;
        let newTodayDate = new Date(todayDate);
        console.log(valueDate, newValueDate, todayDate, newTodayDate);
        if (newValueDate < newTodayDate) {
            res.send({
                status: false,
                state: 'NOT_PROCESSED',
                message: "Cannot Process Backdated Transaction",
            });
        }
        else if (newValueDate > newTodayDate) {
            // log transaction to dB for later processing
            await SqlClient_1.default
                .query(`INSERT INTO dev_db.transactionMaster (companyName, companyID, sessionID, transactionType, totalAmount, Fee, transactionStatus, transactionCount, dateInitiated) VALUES (?,?,?,?,?,?,?,?)['${companyName}','${companyID}', '${sessionID}','${transactionType}', '${totalAmount}', '${Fees}', 'FAILED', '${paymentSchedule.length}', '${date.toString()}']`, (err) => {
                logger.debug(err);
            });
            res.status(200).send({
                status: true,
                state: "Waiting for Value Date to Process transaction",
                message: `Payment Schedule would be processed at ${valueDate}`,
            });
        }
        else {
            if (totalAmount > customerBalance) {
                //Balance Check
                res.status(200).send({
                    state: "INSUFFICIENT_FUNDS",
                    message: "Balance not sufficient to perform the transaction",
                });
            }
            // await dB
            //   .query(
            //     `INSERT INTO payrolldb.transactionMaster (companyName, companyID, sessionID, transactionType, totalAmount, Fee, transactionStatus, transactionCount, dateInitiated) VALUES (?,?,?,?,?,?,?,?)['${companyName}','${companyID}', '${sessionID}','${transactionType}', '${totalAmount}', '${Fees}', 'FAILED', '${
            //       paymentSchedule.length
            //     }', '${date.toString()}']`,
            //     (err: any) => {
            //       logger.debug(err);
            //     }
            //   )
        }
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
        logger.info("Writing transaction details to the transactions table");
        paymentSchedule.forEach((payOut) => {
            console.log("Payment Schedule");
            //   await dB.query(
            //     `INSERT INTO payrolldb.transactionDetails (companyName, companySName, companyID, transactionType, sessionID, beneficiaryName, accountNumber,beneficiaryAccount, transactionAmount, status, referenceNo, dateAdded) VALUES (?,?,?,?,?,?,?,?)['${companyName}','${companySName}','${companyID}','${transactionType}','${sessionID}','${employeeName}','${accountNum}','${beneficialAccount}','${amount}','${"INITIALIZED"}','${
            //       companySName + Math.floor(Math.random() * 1000) + date.toString()
            //     }', '${date.toLocaleString()}']`
            //   );
            // }
        });
        // InitPayrollMail(MoneyFC(Number(totalAmount), "NGN"), paymentSchedule);
        res.send({
            message: "Payment Schedule has been successfully processed.",
            sessionID: sessionID,
            totalAmount: (0, MoneyFC_1.default)(Number(totalAmount + Trans_fee * paymentSchedule.length), "NGN"),
            // Fees: Fees,
            // VAT: VAT,
            // VATFees: (VAT / 100) * totalAmount,
        });
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
    }
    catch (error) {
        logger.error(error);
    }
});
