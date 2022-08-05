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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// INITIALIZE SERVER
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const proxy = require("express-http-proxy");
app.use((0, cors_1.default)({
    // preflightContinue: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// app.use("/api/v1/init-payroll", proxy("https://localhost:6969"));
app.use("/users", proxy("https://localhost:6966"));
app.use("/utils", proxy("https://localhost:6966"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
app.use((0, express_fileupload_1.default)());
const serverOptions = {
    key: fs_1.default.readFileSync(path_1.default.join(__dirname, "../Certificates", "key.pem")),
    cert: fs_1.default.readFileSync(path_1.default.join(__dirname, "../Certificates", "cert.pem")),
    code: fs_1.default.readFileSync(path_1.default.join(__dirname, "../Certificates", "csr.pem")),
    sessionTimeout: 5000,
};
const httpsServer = https_1.default.createServer(serverOptions, app);
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const Auth_1 = __importDefault(require("../Middleware/Auth"));
// const wsServer = new webSocket.Server({ server });
// import soap from "soap";
// Routes
const Login_1 = __importDefault(require("./Routes/Users/Login"));
const Register_1 = __importDefault(require("./Routes/Users/Register"));
const InitPayrollwFile_1 = __importDefault(require("./Routes/PAYROLL/InitPayrollwFile"));
const InitPayrollfromDB_1 = __importDefault(require("./Routes/PAYROLL/InitPayrollfromDB"));
const GenerateOTP_1 = __importDefault(require("./Routes/OTP/GenerateOTP"));
const ValidateOTP_1 = __importDefault(require("./Routes/OTP/ValidateOTP"));
// app.use(Auth);
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
const pino = require("pino");
const pretty = require("pino-pretty");
const stream = pretty({
    colorize: true,
});
const logger = pino(stream);
const UpdatePassword_1 = __importDefault(require("./Routes/Users/UpdatePassword"));
const Airtime_1 = __importDefault(require("./Routes/Utils/Airtime"));
const Requery_1 = __importDefault(require("./Routes/Utils/Requery"));
const AdminLogin_1 = __importDefault(require("./Routes/Users/AdminLogin"));
const InitPayrollProceed_1 = __importDefault(require("./Routes/PAYROLL/InitPayrollProceed"));
// wsServer.on("connection", (ws) => {
//   ws.send("New Client Connection");
//   // console.log(connection)
//   ws.on("message", (data) => {
//     wsServer.clients.forEach((client) => {
//       if (client.readyState === webSocket.OPEN) {
//         client.send(data);
//       }
//     });
//   });
// });
app.use(express_1.default.static(path_1.default.join(__dirname, "../Public/build")));
app.use("/payserv", (req, res) => {
    // logger.info(req);
    res.sendFile(path_1.default.join(__dirname, "../Public/build", "index.html"));
});
//  transactionTypes: BULK_FT || SINGLE_FT || Monthly_FT ||
const transactionType = "BULK_FT";
const customerName = "Serve Nigeria Limited";
("Big Energy Limited");
// IMITIATE CUSTOMER BALANCE REQUEST
app.get("/api/v1/customer", (req, res) => {
    res.send([
        {
            customerID: "122123212",
            customerName: customerName,
            accountNumber: "1234567890",
            BVN: "1323190230",
            availableBalance: "34000000",
            status: "Active",
        },
    ]);
});
app.get("/api/v1/getUploadTemplate", (req, res) => {
    res.send("dhfg");
});
app.use("/api/v1/init-payroll/db", Auth_1.default, InitPayrollfromDB_1.default);
app.post("/api/v1/init-payroll/file", InitPayrollwFile_1.default);
app.post("/api/v1/init-payroll/proceed", Auth_1.default, InitPayrollProceed_1.default);
// USER ROUTES
app.get("/api/v1/login", (req, res) => {
    if (req.session) {
        res.send({ loggedIn: true, user: req.session });
    }
    else {
        res.send({ loggedIn: false });
    }
});
app.post("/api/v1/users/login", Login_1.default);
app.post("/api/v1/users/admin-login", AdminLogin_1.default);
app.post("/api/v1/users/onboarding", Register_1.default);
app.put("/api/v1/users/passwordUpdate", UpdatePassword_1.default);
// OTP
app.get("/api/v1/generate-otp", GenerateOTP_1.default);
app.post("/api/v1/validate-otp", ValidateOTP_1.default);
// AIRTIME
app.post("/api/v1/airtime", Airtime_1.default);
app.get("/api/v1/txn-requery", Requery_1.default);
httpsServer
    .listen(process.env.PORT, () => {
    logger.info(`API Services are available on PORT: ${process.env.PORT}`);
    logger.info(`API Gateway is listening on https Port ${3002}`);
})
    .on("error", (error) => {
    logger.error(error);
    process.exit();
});
