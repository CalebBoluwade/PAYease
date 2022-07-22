import express, { Application, Request, Response } from "express";
const app: Application = express();
import dB from "../../../Config/SqlClient";

export default app.get(
  "api/v1/queryTransactionStatus/transactionType/?=sessionID",
  async (req: Request, res: Response) => {
    let sessionID = req.query["sessionID"];
    let page: number = Number(req.params["page"]);

    let pageLimit = 10;

    let startIndex = (page - 1) * pageLimit;
    let endIndex = page * pageLimit;

    dB.execute(
      `SELECT [sessionID], [status], [transactionType] FROM payrolldb.transactionMaster WHERE sessionID = ${sessionID}`
    ).then(([results, _]: Array<any>) => {
      if (results) {
        results.slice(startIndex, endIndex);

        res.send(results);
      }
    });
  }
);
