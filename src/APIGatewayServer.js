"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const proxy = require("express-http-proxy");
app.use((0, cors_1.default)({
    // preflightContinue: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
}));
app.use('/users', proxy('https://localhost:6966'));
app.use('/payroll', proxy('https://localhost:6966'));
app.use('/utils', proxy('https://localhost:6966'));
app.listen(3002, () => {
    console.log(`API Gateway is listening on https Port ${3002}`);
});
