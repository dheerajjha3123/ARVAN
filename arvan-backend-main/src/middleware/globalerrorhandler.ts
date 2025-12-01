import { Request as ExpressRequest, Response, NextFunction, RequestHandler } from "express";
import HttpStatusCodes from "../common/httpstatuscode.js";
import { RouteError } from "../common/routeerror.js";
import ENV from "../common/env.js";
import { NodeEnvs } from "../common/constants.js";
import { exceptionCodes } from "../common/prismafilter.js";
import { decode, getToken } from "next-auth/jwt";
import { prisma } from "../utils/prismaclient.js";
import axios from "axios";
import util from "util";
import jwt from "jsonwebtoken";


const cleanMessage = (message: string) => message.replace(/(\r\n|\r|\n)/g, " ");
export const globalErrorHandler = (
  err: Error & { code?: string; meta?: any },
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): any => {
  // Log the error unless in test environment
  if (ENV.NODE_ENV !== NodeEnvs.Test.valueOf()) {
    console.error(err);
  }

  // Handle Prisma Known Request Error
  if (err instanceof (prisma as any).$extends.ErrorConstructor.PrismaClientKnownRequestError) {
    const statusCode = err.code ? exceptionCodes[err.code] : HttpStatusCodes.BAD_REQUEST;
    const message =
      ENV.NODE_ENV === "production" ? err.meta : cleanMessage(err.message);
    return res.status(statusCode).json({
      success: false,
      statusCode,
      path: req.url,
      message,
    });
  }

  // Handle Prisma Unknown Request Error
  if (err instanceof (prisma as any).$extends.ErrorConstructor.PrismaClientUnknownRequestError) {
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      path: req.url,
      message: "Something went wrong",
    });
  }

  // Handle Prisma Validation Error
  if (err instanceof (prisma as any).$extends.ErrorConstructor.PrismaClientValidationError) {
    const indexOfArgument = err.message.indexOf("Argument");
    const message = cleanMessage(err.message.substring(indexOfArgument));
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      success: false,
      statusCode: HttpStatusCodes.BAD_REQUEST,
      path: req.url,
      message,
    });
  }

  // Handle custom RouteError
  if (err instanceof RouteError) {

    return res.status(err.status).json({ success: false, error: err.message });
  }
  if (axios.isAxiosError(err)) {
    console.log(JSON.stringify(err,null, 2));
    if (err.response) {
      // The request was made, and the server responded with a status code
      return res.status(err.response.status).json({
        success: false,
        statusCode: err.response.status,
        path: req.url,
        message: err.response.data?.message || "Axios error response",
      });
    } else if (err.request) {
      // The request was made but no response was received
      return res.status(HttpStatusCodes.GATEWAY_TIMEOUT).json({
        success: false,
        statusCode: HttpStatusCodes.GATEWAY_TIMEOUT,
        path: req.url,
        message: "No response from server",
      });
    } else {
      // Something happened in setting up the request
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: HttpStatusCodes.BAD_REQUEST,
        path: req.url,
        message: err.message || "Axios request setup error",
      });
    }
  }
  // Fallback for all other errors
  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    path: req.url,
    message: err.message || "Internal Server Error",
  });
};
declare global {
  namespace Express {
    interface Request {
      user?: any; // Add a `session` property to the Request interface
    }
  }
}

export const authenticateJWT: RequestHandler = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Allow skipping auth check on OTP-related endpoints
    if (req.path.includes('/otp') || req.path.includes('/verify-otp') || req.path.includes('/reset-password') || req.path.includes('/resend-otp')) {
      return next();
    }

    const token = await getToken({ req: req as any, secret: ENV.AUTH_SECRET });

    if (!token) {
      throw new RouteError(403, "Unauthorized: No valid token found");
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: token.id as string },
    });

    if (!userRecord) {
      throw new RouteError(403, "Unauthorized: User not found");
    }

    req.user = userRecord;

    next();
  } catch (error: unknown) {
    console.error("Failed to authenticate", error);
    // Instead of throwing an error, just skip authentication for OTP endpoints
    if (
      typeof req !== "undefined" &&
      'path' in req &&
      typeof req.path === 'string' &&
      (
        (req.path as string).includes('/otp') ||
        (req.path as string).includes('/verify-otp') ||
        (req.path as string).includes('/reset-password') ||
        (req.path as string).includes('/resend-otp')
      )
    ) {
      return next();
    }
    throw new RouteError(401, "Unauthorized");
  }
};


export const isAdmin: RequestHandler = (req: ExpressRequest, res: Response, next: NextFunction) => {
  const adminNumbersEnv: string | undefined = (ENV as any).ADMIN_NUMBERS;
  const adminNumbers = adminNumbersEnv ? adminNumbersEnv.split(',').map((s: string) => s.trim()) : [];
  const userPhone = req.user?.phone || req.user?.userphone || req.user?.mobile_no || "";

  if (adminNumbers.includes(userPhone)) {
    return next();
  }

  // fallback to role check if phone is not listed as admin
  if (req.user.role === "USER") {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  next();
};
