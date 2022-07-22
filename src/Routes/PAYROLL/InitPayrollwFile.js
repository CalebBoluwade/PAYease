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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const XLSX = __importStar(require("xlsx"));
let Trans_fee;
let VAT = 7.5;
// process.env.TRANS_FEE;
const transactionType = "BULK_FT";
const companyName = "Serve Nigeria Limited";
const companyID = 1;
const companySName = "SNL";
const MoneyFC_1 = __importDefault(require("../../../Config/MoneyFC"));
const date = new Date();
// const date = new Date();
exports.default = app.post("/api/v1/init-payroll/file", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }
    if (req.files) {
        const newFile = req.files.file;
        // let fileName: string = file.name;
        let uploadPath = __dirname + "/Uploads/" + newFile.name;
        // check if file exists
        // res.status(200).send("File exists: " + Duplicate upload)
        logger.info(path_1.default.join(uploadPath));
        newFile.mv(path_1.default.join(uploadPath), (err) => {
            if (err) {
                logger.error("Error uploading file");
                res.send("Error uploading file");
                // res.status(500).send(err);
            }
            else {
                // res.send("Uploads successful");
                let workbook = XLSX.readFile(path_1.default.join(`${__dirname}/Uploads/${newFile.name}`));
                let worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const paymentSchedule = XLSX.utils.sheet_to_json(worksheet);
                const Fees = Trans_fee * paymentSchedule.length;
                // Generate Session ID
                //Session ID is encoded as Company Short Name + date.now() + transaction type + _ + count;
                const sessionID = companySName +
                    date.getFullYear() +
                    date.getMonth() +
                    date.getDate() +
                    transactionType +
                    paymentSchedule.length;
                // Rename the file
                let newPath = path_1.default.join(__dirname, "Uploads", `/PAYMENT_SCHEDULE-${sessionID}.xlsx`);
                logger.info(path_1.default.join(newPath));
                fs_1.default.rename(uploadPath, newPath, (err) => {
                    if (err) {
                        logger.error(err);
                        res.send("An error occurred");
                    }
                    logger.info(path_1.default.join(newPath), "Renamed File Successfully");
                });
                let totalAmount = 0;
                for (let i = 2; i < paymentSchedule.length + 2; i++) {
                    const amount = worksheet[`D${i}`].v;
                    totalAmount += amount;
                }
                res.send({
                    sessionID: sessionID,
                    message: "Payment Schedule Received Successfully",
                    paymentSchedule,
                    totalAmount: (0, MoneyFC_1.default)(Number(totalAmount), "NGN"),
                    Fees: Fees,
                    VAT: VAT,
                    VATFees: (VAT / 100) * totalAmount,
                });
            }
        });
    }
}));
// const ws = fs.createWriteStream("../teds.xlsx", "utf-8");
// try {
// res.send(ds ? "" : "")
// if (xlsx.test(newFile.name)) {
// const Fees = Trans_fee * paymentSchedule.length;
// // const testNoOfColumns = XLSX.utils.
// for (let i = 2; i < paymentSchedule.length + 2; i++) {
//   const SN: number = worksheet[`A${i}`].v;
//   const employeeName: string = worksheet[`B${i}`].v;
//   const employeeEmail: string = worksheet[`C${i}`].v;
//   const accountNum: any = worksheet[`E${i}`].v.toString();
//   const beneficialAccount: string = worksheet[`F${i}`].v;
//   const amount: number = worksheet[`D${i}`].v;
//   totalAmount += amount;
// }
//         // paymentSchedule = [...paymentSchedule, newPay]
// ---------------------------------------------------------------
// Check User Account and get account balance
// let acctBalance: Number = 0;
// const userBalanceCheck = async () => {
//   // soap.createClientAsync(process.env.accountEnquiry )
//   acctBalance = 4506340;
// };
// userBalanceCheck();
// if (transactionType === "BULK_FT") {
//   await sample.forEach(
//     (item) => {
//       dB.query(
//         `INSERT INTO payrolldb.transactionDetails (companyName, companySName, companyID, transactionType, sessionID, staffName, transactionAmount, status, referenceNo, dateAdded) VALUES (?,?,?,?,?,?,?)['${companyName}','${companySName}','${companyID}','${transactionType}','${sessionID}','${
//           item.staffName
//         }','${item.amount}', '${"INITIALIZED"}','${
//           companySName + Math.floor(Math.random() * 1000)
//         }', ${date.toLocaleString()}, '${(totalAmount += item.amount)}']`
//       );
//     },
//     async () => {
//       if (totalAmount + TRANS_FEE > acctBalance) {
//         try {
//           dB.query(
//             `UPDATE payrolldb.transactionDetails SET responseMessage = 'Insufficient funds' AND responseCode = '${dB.query(
//               `SELECT TOP 1 FROM payrolldb.codes WHERE responseMessage = 'Insufficient funds' AND responseCode = 'Insufficient funds'`
//             )}' WHERE companyID = '${companyID}' AND sessionID = '${sessionID}'`
//           );
//           res.send({ message: "Insufficient funds", responseCode: 52 });
//           res.end();
//         } catch (err) {
//           logger.info(err);
//         }
//       } else {
//         // INITIALIZE DEBIT
//         const url: string = `https://api.paypal.com/payment`;
//         const headers: object = {
//           "content-type": "application/json; charset=utf-8",
//           connection: "keep-alive",
//         };
//         // soap.createClient(url, headers, () => {
//         //   return;
//         // });
//         if (totalAmount < acctBalance) {
//           try {
//             dB.query(
//               `UPDATE payrolldb.transactionDetails SET status = 'Successful', responseMessage = 'Successful' AND responseCode = '00' WHERE companyID = '${companyID}' AND sessionID = '${sessionID}'`
//             );
//             res.send({ message: "Insufficient funds", responseCode: 52 });
//             res.end();
//           } catch (err) {
//             logger.info(err);
//           }
//         }
//       }
//     }
//   );
// }
// await dB.query(
//   `INSERT INTO payrolldb.transactionMaster VALUES (?,?,?,?,?,?,?)['${companyID}','${companyName}', '${sessionID}', '${totalAmount}', '${
//     sample.length
//   }','${companySName + Math.random()}', ${date.toLocaleString()}]`
// );
// if (transactionType === "SINGLE_FT") {
//   let { sampleSingleFT } = req.body;
//   if (sampleSingleFT) {
//     dB.query(
//       `INSERT INTO payrolldb.transactionMaster VALUES (?,?,?,?,?,?,?)['${
//         sampleSingleFT.name
//       }','${
//         sampleSingleFT.amount
//       }', '${companyName}', '${sessionID}', ${date.toLocaleString()}]`
//     )
//       .then(() => {
//         fetch(
//           `https://api.example.com/v1/transactions/${transactionType}/transaction`
//         );
//       })
//       .catch((err: Error) => {
//         logger.info(err);
//       });
//   }
// }
// if (transactionType === "Monthly_FT") {
//   await dB
//     .query(
//       `SELECT [staffName],], [bankCode], [salary] FROM payrolldb.dbo.CompanySheet WHERE companyID = ${companyID}`
//     )
//     .then(([results, _]: Array<object>) => {});
// }
// res.send(sessionID);
//   wsServer.on("create", (sample: object) => {
//     console.log(sessionID, sample);
//   });
//   const abort = AbortController;
