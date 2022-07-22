import express, { Request, Response, NextFunction } from "express";
require("dotenv").config();
import Roles from "../Config/Roles";

const userName = "APIv1User";
const password = "APIv1Password";

const user = process.env.user;
const Password = process.env.password;

const Auth = async (req: Request, res: Response, next: any) => {
  if (req.headers.authorization) {
    if (req.headers.authorization === user + ":" + Password) {
      next();
    } else {
      res.status(401);
      res.end("UNAUTHORIZED");
    }
  } else {
    res.status(401);
    res.end("UNAUTHORIZED");
  }
};

export default Auth;
