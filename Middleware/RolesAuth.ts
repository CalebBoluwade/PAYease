import express, { Request, Response, NextFunction } from "express";
import Roles from "../Config/Roles";
import Actions from "../Config/Actions";

let userRole = "ENDUSER";

const RolesAuth = async (req: Request, res: Response, next: any) => {
  console.log(Roles, Actions);

  //   if (userRole) {
  //     res.send("You are not permitted to access this resource.");
  //   }

  //   if (Roles.role === "ADMIN") {
  //     next();
  //   }
  next();
};

export default RolesAuth;
