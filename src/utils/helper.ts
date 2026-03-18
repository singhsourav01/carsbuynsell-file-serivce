import { ApiError } from "common-microservices-utils";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { StatusCodes } from "http-status-codes";
import {
  API_ERRORS,
  INTEGERS,
  MIME_TYPES,
  STRINGS,
  allowedFileTypes,
} from "../constants/app.constant";
import { uploadBufferToS3 } from "../configs/s3.config";

export const queryHandler = async <T>(
  queryPromise: () => Promise<T>
): Promise<T> => {
  try {
    return await queryPromise();
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      API_ERRORS.DATABASE_ERROR
    );
  }
};

export const getIsFileSupported = (uploadType: string, file: any) => {
  return allowedFileTypes[uploadType].includes(file.mimetype);
};

export const createThumbnail = async (
  typeData: any,
  file: any
): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg.setFfmpegPath(ffmpegStatic || "");

    // Generate S3 key for thumbnail
    const thumbnailKey = createS3Key(
      typeData,
      STRINGS.THUMBNAIL,
      file.newFilename + STRINGS.PNG_EXTENSION
    );

    const tempThumbnailDir = path.join(process.cwd(), STRINGS.THUMBNAIL);
    if (!fs.existsSync(tempThumbnailDir)) {
      fs.mkdirSync(tempThumbnailDir, { recursive: true });
    }

    ffmpeg()
      .input(file.filepath)
      .takeScreenshots(
        {
          count: 1,
          timemarks: STRINGS.THUMBNAIL_TIMING,
          filename: file.newFilename,
        },
        tempThumbnailDir
      )
      .on("end", async () => {
        const tempThumbnailPath = path.join(
          tempThumbnailDir,
          file.newFilename + STRINGS.PNG_EXTENSION
        );

        // Upload thumbnail to S3
        if (fs.existsSync(tempThumbnailPath)) {
          try {
            const thumbnailBuffer = fs.readFileSync(tempThumbnailPath);
            await uploadBufferToS3(thumbnailBuffer, thumbnailKey, MIME_TYPES.IMAGE_PNG);
            fs.unlinkSync(tempThumbnailPath); // Clean up temp file
            resolve(thumbnailKey);
          } catch (err) {
            fs.unlinkSync(tempThumbnailPath);
            reject(err);
          }
        } else {
          reject(new Error("Thumbnail not generated"));
        }
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

// S3 folder prefix - all files will be stored inside this folder
const S3_FOLDER_PREFIX = "images";

export const createS3Key = (
  typeData: any,
  mediaType: string,
  fileName: string
) => {
  const { keyPrefix, isMultiMedia } = typeData;
  const key = isMultiMedia
    ? keyPrefix + STRINGS.FORWARD_SLASH + mediaType
    : keyPrefix;
  return S3_FOLDER_PREFIX + STRINGS.FORWARD_SLASH + key + STRINGS.FORWARD_SLASH + Date.now() + STRINGS.HYPHEN + fileName;
};

export const createFileUrl = (
  typeData: any,
  mediaType: string,
  fileName: string
) => {
  // Creates S3 object key with images/ prefix
  const { keyPrefix, isMultiMedia } = typeData;
  const key = isMultiMedia
    ? keyPrefix + STRINGS.FORWARD_SLASH + mediaType
    : keyPrefix;
  return S3_FOLDER_PREFIX + STRINGS.FORWARD_SLASH + key + STRINGS.FORWARD_SLASH + Date.now() + STRINGS.HYPHEN + fileName;
};

export const getKeyFromUrl = (url: string) => {
  // For backwards compatibility - extracts key from old URL format or returns key as-is
  if (url.startsWith("/uploads/")) {
    return url.replace("/uploads/", "");
  }
  return url;
};
