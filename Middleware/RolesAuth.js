"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Roles_1 = __importDefault(require("../Config/Roles"));
const Actions_1 = __importDefault(require("../Config/Actions"));
let userRole = "ENDUSER";
const RolesAuth = async (req, res, next) => {
    console.log(Roles_1.default, Actions_1.default);
    //   if (userRole) {
    //     res.send("You are not permitted to access this resource.");
    //   }
    //   if (Roles.role === "ADMIN") {
    //     next();
    //   }
    next();
};
exports.default = RolesAuth;
