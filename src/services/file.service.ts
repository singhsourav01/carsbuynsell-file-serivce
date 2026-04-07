import { Prisma } from "@prisma/client";
import { ApiError } from "common-microservices-utils";
import { StatusCodes } from "http-status-codes";
import { API_ERRORS, STRINGS, allMimeTypes } from "../constants/app.constant";
import FileRepository from "../repositories/file.repository";
import { createFileUrl, createThumbnail, getKeyFromUrl } from "../utils/helper";
import { uploadToS3, deleteFromS3, generateSignedUrl } from "../configs/s3.config";

class FileService {
  fileRepository: FileRepository;
  constructor() {
    this.fileRepository = new FileRepository();
  }

  upload = async (
    files: any,
    typeData: any,
    uploadId: any,
    uploadType: string
  ) => {
    let resultData: Prisma.filesCreateInput[] = [];

    const promises = files.map(async (file: any) => {
      const mediaType = allMimeTypes[file.mimetype];

      // Create S3 object key using helper function
      const s3Key = createFileUrl(typeData, mediaType, file.originalFilename);

      // Upload file to S3
      await uploadToS3(file.filepath, s3Key, file.mimetype);

      // Generate thumbnail for videos and upload to S3
      let thumbnailKey: string | null = null;
      if (mediaType === STRINGS.VIDEO) {
        thumbnailKey = await createThumbnail(typeData, file);
      }

      const data = {
        file_uploaded_by_id: uploadId,
        file_upload_type: uploadType,
        file_is_deleted: false,
        file_media_type: mediaType,
        file_url: s3Key,
        file_thumbnail_url: thumbnailKey,
      };

      const createdFile = await this.fileRepository.create(data);
      resultData.push(createdFile);
    });

    await Promise.all(promises);
    return resultData;
  };

  uploadListingFiles = async (
  files: any,
  typeData: any,
  listingId: any,
  userId: any,
  uploadType: string
) => {

  let resultData: Prisma.filesCreateInput[] = []

  const promises = files.map(async (file: any) => {

    const mediaType = allMimeTypes[file.mimetype]

    const s3Key = createFileUrl(
      typeData,
      mediaType,
      file.originalFilename
    )

    await uploadToS3(
      file.filepath,
      s3Key,
      file.mimetype
    )

    let thumbnailKey = null

    if (mediaType === STRINGS.VIDEO) {
      thumbnailKey =
        await createThumbnail(typeData, file)
    }

    const data = {

      file_uploaded_by_id: userId,   // ✅ uploader

      file_listing_id: listingId,    // ✅ linked listing

      file_upload_type: uploadType,

      file_is_deleted: false,

      file_media_type: mediaType,

      file_url: s3Key,

      file_thumbnail_url: thumbnailKey,
    }

    const createdFile =
      await this.fileRepository.create(data)

    resultData.push(createdFile)
  })

  await Promise.all(promises)

  return resultData
}

  getByIds = async (file_ids: string[]) => {
    return await this.fileRepository.getByIds(file_ids);
  };

  getById = async (file_id: string) => {
    return await this.fileRepository.getById(file_id);
  };

  getByUserId = async (user_id: string) => {
    return await this.fileRepository.getByUserId(user_id);
  };

  getByListingId = async (listing_id: string) => {
    return await this.fileRepository.getByListingId(listing_id);
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

    // Delete main file from S3
    if (file.file_url) {
      const fileKey = getKeyFromUrl(file.file_url);
      try {
        await deleteFromS3(fileKey);
      } catch (err) {
        // File may not exist in S3, continue with deletion
        console.log("Error deleting file from S3:", err);
      }
    }

    // Delete thumbnail from S3 if exists
    if (file.file_thumbnail_url) {
      const thumbnailKey = getKeyFromUrl(file.file_thumbnail_url);
      try {
        await deleteFromS3(thumbnailKey);
      } catch (err) {
        // Thumbnail may not exist in S3, continue with deletion
        console.log("Error deleting thumbnail from S3:", err);
      }
    }

    return await this.fileRepository.deleteById(file.file_id);
  };
}

export default FileService;
