require("dotenv").config();
import express, { Application, Request, Response } from "express";
const app: Application = express();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);
import path from "path";
import fs from "fs";

import * as XLSX from "xlsx";

let Trans_fee: 145;
let VAT: number = 7.5;
// process.env.TRANS_FEE;

const transactionType: string = "BULK_FT";
const companyName: string = "Serve Nigeria Limited";
const companyID: number = 1;
const companySName = "SNL";
import MoneyFC from "../../../Config/MoneyFC";

const date = new Date();

// const date = new Date();

export default app.post(
  "/api/v1/init-payroll/file",
  async (req: Request, res: Response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    if (req.files) {
      const newFile: any = req.files.file;
      // let fileName: string = file.name;
      let uploadPath: string = __dirname + "/Uploads/" + newFile.name;

      // check if file exists
      // res.status(200).send("File exists: " + Duplicate upload)
      logger.info(path.join(uploadPath));
      newFile.mv(path.join(uploadPath), (err: any) => {
        if (err) {
          logger.error("Error uploading file");
          res.send("Error uploading file");
          // res.status(500).send(err);
        } else {
          // res.send("Uploads successful");
          let workbook = XLSX.readFile(
            path.join(`${__dirname}/Uploads/${newFile.name}`)
          );
          let worksheet = workbook.Sheets[workbook.SheetNames[0]];

          const paymentSchedule = XLSX.utils.sheet_to_json(worksheet);
          const Fees = Trans_fee * paymentSchedule.length;

          // Generate Session ID
          //Session ID is encoded as Company Short Name + date.now() + transaction type + _ + count;
          const sessionID: string =
            companySName +
            date.getFullYear() +
            date.getMonth() +
            date.getDate() +
            transactionType +
            paymentSchedule.length;

          // Rename the file
          let newPath: string = path.join(
            __dirname,
            "Uploads",
            `/PAYMENT_SCHEDULE-${sessionID}.xlsx`
          );

          logger.info(path.join(newPath));
          fs.rename(uploadPath, newPath, (err) => {
            if (err) {
              logger.error(err);
              res.send("An error occurred");
            }

            logger.info(path.join(newPath), "Renamed File Successfully");
          });

          let totalAmount = 0;
          for (let i = 2; i < paymentSchedule.length + 2; i++) {
            const amount: number = worksheet[`D${i}`].v;
            totalAmount += amount;
          }

          res.send({
            sessionID: sessionID,
            message: "Payment Schedule Received Successfully",
            paymentSchedule,
            totalAmount: MoneyFC(Number(totalAmount), "NGN"),
            Fees: Fees,
            VAT: VAT,
            VATFees: (VAT / 100) * totalAmount,
          });
        }
      });
    }
  }
);

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
