"use strict";
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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const SqlClient_1 = __importDefault(require("../../../Config/SqlClient"));
exports.default = app.get("api/v1/queryTransactionStatus/transactionType/?=sessionID", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sessionID = req.query["sessionID"];
    let page = Number(req.params["page"]);
    let pageLimit = 10;
    let startIndex = (page - 1) * pageLimit;
    let endIndex = page * pageLimit;
    SqlClient_1.default.execute(`SELECT [sessionID], [status], [transactionType] FROM payrolldb.transactionMaster WHERE sessionID = ${sessionID}`).then(([results, _]) => {
        if (results) {
            results.slice(startIndex, endIndex);
            res.send(results);
        }
    });
}));
