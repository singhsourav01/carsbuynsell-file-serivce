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
  file: any,
  uploadsDir: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg.setFfmpegPath(ffmpegStatic || "");
    const relativePath = createFileUrl(
      typeData,
      STRINGS.THUMBNAIL,
      file.newFilename + STRINGS.PNG_EXTENSION
    );

    const thumbnailFullPath = path.join(uploadsDir, relativePath);
    const thumbnailDir = path.dirname(thumbnailFullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

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
      .on("end", () => {
        const tempThumbnailPath = path.join(
          tempThumbnailDir,
          file.newFilename + STRINGS.PNG_EXTENSION
        );

        // Move thumbnail to uploads directory
        if (fs.existsSync(tempThumbnailPath)) {
          fs.copyFileSync(tempThumbnailPath, thumbnailFullPath);
          fs.unlinkSync(tempThumbnailPath); // Clean up temp file
        }

        const thumbnailUrl = `/uploads/${relativePath.replace(/\\/g, "/")}`;
        resolve(thumbnailUrl);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export const createFileUrl = (
  typeData: any,
  mediaType: string,
  fileName: string
) => {
  const { keyPrefix, isMultiMedia } = typeData;
  const key = isMultiMedia
    ? keyPrefix + STRINGS.FORWARD_SLASH + mediaType
    : keyPrefix;
  return key + STRINGS.FORWARD_SLASH + Date.now() + STRINGS.HYPHEN + fileName;
};

export const getKeyFromUrl = (url: string) => {
  return url
    .split(STRINGS.FORWARD_SLASH)
    .slice(INTEGERS.THREE)
    .join(STRINGS.FORWARD_SLASH);
};
