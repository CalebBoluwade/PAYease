"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const SqlClient_1 = __importDefault(require("../../../Config/SqlClient"));
exports.default = app.get("api/v1/queryTransactionStatus/?=companyID", async (req, res) => {
    let companyID = req.query["companyID"];
    // let {companyID} = req.session.userData;
    let page = Number(req.params["page"]);
    let pageLimit = 10;
    let startIndex = (page - 1) * pageLimit;
    let endIndex = page * pageLimit;
    SqlClient_1.default.execute(`SELECT [sessionID], [status], [transactionType], [dateCreated] FROM payrolldb.transactionMaster WHERE companyID = ${companyID}`).then(([results, _]) => {
        if (results) {
            results.slice(startIndex, endIndex);
            res.send(results);
        }
    });
});
