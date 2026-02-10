import { Prisma } from "@prisma/client";
import { ApiError } from "common-microservices-utils";
import fs from "fs";
import path from "path";
import { StatusCodes } from "http-status-codes";
import { API_ERRORS, STRINGS, allMimeTypes } from "../constants/app.constant";
import FileRepository from "../repositories/file.repository";
import { createFileUrl, createThumbnail } from "../utils/helper";

class FileService {
  fileRepository: FileRepository;
  constructor() {
    this.fileRepository = new FileRepository();
  }

  upload = async (
    files: any,
    typeData: any,
    uploadId: string,
    uploadType: string
  ) => {
    const uploadsDir = path.join(process.cwd(), "uploads");
    let resultData: Prisma.filesCreateInput[] = [];

    const promises = files.map(async (file: any) => {
      const mediaType = allMimeTypes[file.mimetype];
      
      // Create file path using helper function
      const relativePath = createFileUrl(typeData, mediaType, file.originalFilename);
      const fullPath = path.join(uploadsDir, relativePath);
      
      // Create directory structure if it doesn't exist
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Copy file from temp location to uploads directory
      fs.copyFileSync(file.filepath, fullPath);

      // Generate file URL for serving
      const fileUrl = `/uploads/${relativePath.replace(/\\/g, "/")}`;
      
      // Generate thumbnail for videos
      let thumbnailUrl: string | null = null;
      if (mediaType === STRINGS.VIDEO) {
        thumbnailUrl = await createThumbnail(typeData, file, uploadsDir);
      }

      const data = {
        file_uploaded_by_id: uploadId,
        file_upload_type: uploadType,
        file_is_deleted: false,
        file_media_type: mediaType,
        file_url: fileUrl,
        file_thumbnail_url: thumbnailUrl,
      };
      
      const createdFile = await this.fileRepository.create(data);
      resultData.push(createdFile);
    });

    await Promise.all(promises);
    return resultData;
  };

  getByIds = async (file_ids: string[]) => {
    return await this.fileRepository.getByIds(file_ids);
  };

  getById = async (file_id: string) => {
    return await this.fileRepository.getById(file_id);
  };

  deleteByIds = async (file_ids: string[]) => {
    const files = await this.fileRepository.getByIds(file_ids);

    if (files.length !== file_ids.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, API_ERRORS.FILES_NOT_FOUND);
    }

    const promises = files.map(async (file: any) => {
      return await this.deleteById(file.file_id);
    });

    await Promise.all(promises).catch((err) => {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        API_ERRORS.ERROR_DELETING_FILE,
        err
      );
    });
  };

  deleteById = async (file_id: string) => {
    const file = await this.fileRepository.getById(file_id);
    if (!file)
      throw new ApiError(StatusCodes.NOT_FOUND, API_ERRORS.FILE_NOT_FOUND);

    const uploadsDir = path.join(process.cwd(), "uploads");

    // Delete main file
    if (file.file_url) {
      const filePath = path.join(uploadsDir, file.file_url.replace("/uploads/", ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete thumbnail if exists
    if (file.file_thumbnail_url) {
      const thumbnailPath = path.join(uploadsDir, file.file_thumbnail_url.replace("/uploads/", ""));
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    return await this.fileRepository.deleteById(file.file_id);
  };
}

export default FileService;
