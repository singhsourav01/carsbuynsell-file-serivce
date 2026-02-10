import { ApiError } from "common-microservices-utils";
import contentType from "content-type";
import { NextFunction, Request, Response } from "express";
import formidable, { errors as formidableErrors } from "formidable";
import { StatusCodes } from "http-status-codes";
import {
  API_ERRORS,
  INTEGERS,
  MAX_FILE_SIZE,
  MAX_TOTAL_FILE_SIZE,
  STRINGS,
  UPLOAD_TYPES,
} from "../constants/app.constant";
import { CONTENT_TYPES } from "../constants/swagger.constant";
import { getIsFileSupported } from "../utils/helper";

export const fileMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentTypeHeader = req.headers[STRINGS.CONTENT_TYPE];
  //@ts-ignore
  const parsedContentType = contentType.parse(contentTypeHeader);
  if (parsedContentType.type !== CONTENT_TYPES.FORM_DATA) {
    return next(
      new ApiError(
        StatusCodes.UNSUPPORTED_MEDIA_TYPE,
        API_ERRORS.UNSUPPORTED_CONTENT_TYPE
      )
    );
  }
  const form = formidable({
    multiples: true,
    allowEmptyFiles: true,
    maxFileSize: MAX_FILE_SIZE,
    maxTotalFileSize: MAX_TOTAL_FILE_SIZE,
    minFileSize: INTEGERS.ZERO,
  });

  form.parse(req, async (error: any, fields: any, files: any) => {
    if (error) {
      if (error.code === formidableErrors.biggerThanMaxFileSize) {
        return next(
          new ApiError(
            StatusCodes.REQUEST_TOO_LONG,
            API_ERRORS.FILE_IS_TO_LARGE,
            error
          )
        );
        //@ts-ignore
      } else if (error.code === formidableErrors?.biggerThanTotalMaxFileSize) {
        return next(
          new ApiError(
            StatusCodes.REQUEST_TOO_LONG,
            API_ERRORS.TOTAL_FILES_SIZE_TO_LARGE,
            error
          )
        );
      } else {
        return next(
          new ApiError(
            StatusCodes.REQUEST_TOO_LONG,
            API_ERRORS.SOMETHING_WENT_WRONG,
            error
          )
        );
      }
    } else {
      console.log(files,  fields, "files and fiedls");
      if (!files?.files || !fields?.type) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.ALL_FIELDS_REQUIRED)
        );
      }

      if (
        !Object.values(UPLOAD_TYPES).includes(fields?.type?.[INTEGERS.ZERO]) ||
        fields?.type.length > INTEGERS.ONE
      ) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, API_ERRORS.VALID_TYPE)
        );
      }

      files?.files?.forEach((file: File) => {
        const isFileSupported = getIsFileSupported(
          fields?.type?.[INTEGERS.ZERO],
          file
        );

        if (!isFileSupported)
          next(
            new ApiError(
              StatusCodes.BAD_REQUEST,
              API_ERRORS.UNSUPPORTED_MEDIA_TYPE
            )
          );
      });

      req.body.files = files?.files;
      req.body.fields = {
        uploadType: fields?.type?.[INTEGERS.ZERO],
      };

      next();
    }
  });
};
