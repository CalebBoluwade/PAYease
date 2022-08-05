import express, { Application, Request, Response } from "express";
const app: Application = express();
import * as dotenv from 'dotenv';
dotenv.config();
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
  colorize: true,
});
const logger = pino(stream);
import path from "path";
// import fs from "fs";
import * as XLSX from "xlsx";
import InitPayrollMail from "../../Mails/InitPayrollMail";
import MoneyFC from "../../Config/MoneyFC";
import dB from "../../Config/SqlClient";

const transactionType: string = "BULK_FT";
const companyName: string = "Serve Nigeria Limited";
const companyID: number = 1;
const companySName = "SNL";

const date = new Date();
const xlsx = /\.xlsx/gi;

export default app.post(
  "/api/v1/init-payroll/proceed",
  async (req: Request, res: Response) => {
    let Trans_fee: number = 145;
    let VAT = process.env.VAT
    let totalAmount: number = 0;

    let { sessionID, customerBalance, valueDate } = req.body;
    // if (xlsx.test()) {
    try {
      ;
      let workbook = await XLSX.readFile(
        path.join(`${__dirname}/Uploads/PAYMENT_SCHEDULE_${sessionID}.xlsx`)
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

      // I Don't like dates
      let newValueDate: Date = new Date(valueDate);
      let DateFormat = `${date.getDate()}`;
      let MonthFormat = `${date.getMonth() + 1}`;
      console.log(MonthFormat, MonthFormat.length, "0" + `${date.getDate() + 1}`);
      let todayDate: any = `${date.getFullYear()}-${MonthFormat.length == 1 ? "0" + `${date.getMonth() + 1}` : date.getMonth() + 1}-${DateFormat.length == 1 ? "0" + `${date.getDate()}` : date.getDate()}`;
      let newTodayDate: Date = new Date(todayDate);

      console.log(valueDate, newValueDate, todayDate, newTodayDate)

      if (newValueDate < newTodayDate) {
        res.send({
          status: false,
          state: 'NOT_PROCESSED',
          message: "Cannot Process Backdated Transaction",
        })
      } else if (newValueDate > newTodayDate) {
        // log transaction to dB for later processing

        await dB
          .query(
            `INSERT INTO dev_db.transactionMaster (companyName, companyID, sessionID, transactionType, totalAmount, Fee, transactionStatus, transactionCount, dateInitiated) VALUES (?,?,?,?,?,?,?,?)['${companyName}','${companyID}', '${sessionID}','${transactionType}', '${totalAmount}', '${Fees}', 'FAILED', '${paymentSchedule.length
            }', '${date.toString()}']`,
            (err: any) => {
              logger.debug(err);
            }
          )

        res.status(200).send({
          status: true,
          state: "Waiting for Value Date to Process transaction",
          message: `Payment Schedule would be processed at ${valueDate}`,
        })
      } else {
        if (totalAmount > customerBalance) {
          //Balance Check
          res.status(200).send({
            state: "INSUFFICIENT_FUNDS",
            message: "Balance not sufficient to perform the transaction",
          })
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
        totalAmount: MoneyFC(Number(totalAmount + Trans_fee * paymentSchedule.length), "NGN"),
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

    } catch (error) {
      logger.error(error);
    }

  }
);
