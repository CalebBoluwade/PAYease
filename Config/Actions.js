"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Roles_1 = __importDefault(require("./Roles"));
const Actions = [
    {
        actionName: "DELETE",
        allowAction: true,
        allowUser: [Roles_1.default.role["SYS_ADMIN"]],
    },
    {
        actionName: "ADD-BENEFICIARY",
        allowAction: true,
        allowUser: [Roles_1.default.role["SYS_ADMIN"], Roles_1.default.role["ADMIN"]],
    },
];
exports.default = Actions;
