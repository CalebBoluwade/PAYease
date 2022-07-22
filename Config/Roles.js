"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Roles = [
    {
        role: "SYS_ADMIN",
        // permissions: ["ALL"],
    },
    {
        role: "ADMIN",
        // permissions: ["ALL"],
    },
    {
        role: "ENDUSER",
        // permissions: ["VIEW"],
    },
    {
        role: "AUTHORIZER",
        // permissions: ["APPROVE"],
    },
    {
        role: "REVIEW_STAGE_2",
        // permissions: ["APPROVE", "AUTHORIZE"],
    },
];
var Role;
(function (Role) {
    Role[Role["ENDUSER"] = 0] = "ENDUSER";
    Role[Role["ADMIN"] = 1] = "ADMIN";
    Role[Role["AUTHORIZER"] = 2] = "AUTHORIZER";
})(Role || (Role = {}));
exports.default = Roles;
