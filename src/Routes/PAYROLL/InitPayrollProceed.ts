import express, { Application, Request, Response } from "express";
const app: Application = express();
require("dotenv").config();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";
import dB from "../../../Config/SqlClient";

const transactionType: string = "BULK_FT";
const companyName: string = "Serve Nigeria Limited";
const companyID: number = 1;
const companySName = "SNL";

const xlsx = /\.xlsx/gi;

export default app.post(
  "/api/v1/init-payroll/proceed",
  (req: Request, res: Response) => {
    let { sessionID } = req.body;

    let Trans_fee: number = 145;
    let VAT: number = 7.5;
    let totalAmount = 0;

    // if (xlsx.test()) {
    let workbook = XLSX.readFile(
      path.join(`${__dirname}/Uploads/PAYMENT_SCHEDULE_${sessionID}`)
    );

    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const paymentSchedule = XLSX.utils.sheet_to_json(worksheet);

    const Fees = Trans_fee * paymentSchedule.length;
    // const testNoOfColumns = XLSX.utils.
    for (let i = 2; i < paymentSchedule.length + 2; i++) {
      const SN: number = worksheet[`A${i}`].v;
      const employeeName: string = worksheet[`B${i}`].v;
      const employeeEmail: string = worksheet[`C${i}`].v;
      const accountNum: any = worksheet[`E${i}`].v.toString();
      const beneficialAccount: string = worksheet[`F${i}`].v;
      const amount: number = worksheet[`D${i}`].v;
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
  }
);
