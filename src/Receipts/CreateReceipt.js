"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const logger = require("pino")();
const fs_1 = __importDefault(require("fs"));
const ws = fs_1.default.createWriteStream("./test.txt");
exports.default = app.post("/api/v1/new-receipt", (req, res) => {
    const rs = fs_1.default.createReadStream(req.body.file, { encoding: "utf8" });
    rs.pipe(ws);
});
