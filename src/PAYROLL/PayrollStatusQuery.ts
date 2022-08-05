import express, { Application, Request, Response } from "express";
const app: Application = express();
import dB from "../../Config/SqlClient";

export default app.get(
  "api/v1/queryTransactionStatus/?=companyID",
  async (req: Request, res: Response) => {
    let companyID = req.query["companyID"];
    // let {companyID} = req.session.userData;
    let page: number = Number(req.params["page"]);

    let pageLimit = 10;

    let startIndex = (page - 1) * pageLimit;
    let endIndex = page * pageLimit;

    dB.execute(
      `SELECT [sessionID], [status], [transactionType], [dateCreated] FROM payrolldb.transactionMaster WHERE companyID = ${companyID}`
    ).then(([results, _]: Array<any>) => {
      if (results) {
        results.slice(startIndex, endIndex);
        res.send(results);
      }
    });
  }
);
