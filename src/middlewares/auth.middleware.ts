import { ApiError, ApiResponse } from "common-microservices-utils";
import { NextFunction } from "express";
import { GetVerificationKey, expressjwt } from "express-jwt";
import { StatusCodes } from "http-status-codes";
import { expressJwtSecret } from "jwks-rsa";
import {
  API_ERRORS,
  AUTH_SERVICE,
  JWKS_FOLDER,
  ROLES,
  STRINGS,
  UPLOAD_TYPES,
} from "../constants/app.constant";

export const authUser = () => {
  return (req: any, res: any, next: NextFunction) => {
    console.log(req.body.fiedls, " Here is fiedls");
    if (req.body.fields.uploadType === UPLOAD_TYPES.REPORT_ISSUE) {
      return next();
    }
    return expressjwt({
      secret: expressJwtSecret({
        jwksUri: AUTH_SERVICE + JWKS_FOLDER,
        cache: true,
        rateLimit: true,
      }) as GetVerificationKey,
      algorithms: ["RS256"],
      requestProperty: STRINGS.USER,
    })(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  };
};
