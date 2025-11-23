import express from "express";

declare global {
  namespace Express {
    interface User {
      id?: string;
      name?: string;
      mobile_no?: string;
      // add other properties as used in req.user
    }

    interface Request {
      user?: User;
    }
  }
}
