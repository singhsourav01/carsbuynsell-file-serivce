import {
  ApiError,
  ApiResponse,
  asyncHandler,
} from "common-microservices-utils";
import FileService from "../services/file.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { API_ERRORS, API_RESPONSES, INTEGERS } from "../constants/app.constant";
import { getTypeData } from "../utils/getTypeData";

interface CustomRequest extends Request {
  user?: {
    user_id: string;
    userType: string;
  };
}

class FileController {
  fileService: FileService;
  constructor() {
    this.fileService = new FileService();
  }

  upload = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { user_id } = req.query;
    const { fields, files } = req.body;
    const { uploadType } = fields;


    const typeData = await getTypeData(
      user_id || "user",
      uploadType,
      req.user?.userType || "user"
    );
    const uploadedFiles = await this.fileService.upload(
      files,
      typeData,
      user_id || "",
      uploadType
    );
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          uploadedFiles,
          API_RESPONSES.FILE_UPLOADED
        )
      );
  });

  getByIds = asyncHandler(async (req: Request, res: Response) => {
    let file_ids = req.body.file_ids;
    const files = await this.fileService.getByIds(file_ids);

    if (files.length === INTEGERS.ZERO)
      throw new ApiError(StatusCodes.NOT_FOUND, API_ERRORS.FILES_NOT_FOUND);

    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, files, API_RESPONSES.FILES_FOUND));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { file_id } = req.params;
    console.log(file_id, " here is id");
    const file = await this.fileService.getById(file_id);

    if (!file)
      throw new ApiError(StatusCodes.NOT_FOUND, API_ERRORS.FILE_NOT_FOUND);

    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, file, API_RESPONSES.FILE_FOUND));
  });

  deleteByIds = asyncHandler(async (req: Request, res: Response) => {
    const { file_ids } = req.body;
    await this.fileService.deleteByIds(file_ids);
    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, {}, API_RESPONSES.FILES_DELETED));
  });

  deleteById = asyncHandler(async (req: Request, res: Response) => {
    const { file_id } = req.params;
    await this.fileService.deleteById(file_id);
    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, {}, API_RESPONSES.FILE_DELETED));
  });
}

export default FileController;
