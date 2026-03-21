import { file_media_type } from "@prisma/client";

export const PORT = 3003;

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  BASIC: "BASIC",
};
export const BASE_URL = "/file";

export const API_ENDPOINTS = {
  SWAGGER: "/file/swagger",
  STAR: "*",
  VERIFY_JWT: "/verify-jwt",
  AUTH_SERVICE_BASE:
    "http://13.127.188.130:3001/auth",
  UPLOAD: "/upload",
  DELETE: "/delete",
  GET: "/get",
  GET_BY_ID: "/get/:file_id",
  DELETE_BY_ID: "/delete/:file_id",
};

export const API_RESPONSES = {
  FILE_UPLOADED: "Files uploaded successfully",
  FILES_DELETED: "Files deleted successfully",
  FILE_DELETED: "File deleted successfully",
  FILES_FOUND: "Files found successfully",
  FILE_FOUND: "File found successfully",
};

export const API_ERRORS = {
  INVALID_ACCESS_TOKEN: "Invalid access token",
  ROUTE_NOT_FOUND: "Route not Found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  ALL_FIELDS_REQUIRED: "All fields required",
  TYPE_REQUIRED: "Type field is required",
  FILES_REQUIRED: "Files are required",
  VALID_TYPE: "Please provide valid type",
  ID_REQUIRED: "Id field is required",
  FILE_IS_TO_LARGE: "File size limit exceed. max file size is 400MB",
  TOTAL_FILES_SIZE_TO_LARGE:
    "Total files size limit exceed, max total file size is 4GB",
  ERROR_CREATING_FILE: "Error while creating file",
  ERROR_DELETING_FILE: "Error while deleting file",
  UNSUPPORTED_MEDIA_TYPE: "Unsupported media type",
  UNSUPPORTED_CONTENT_TYPE: "Unsupported Content type",
  FILE_IDS_REQUIRED: "File_ids field are required",
  FILES_NOT_FOUND: "Files not found",
  FILE_NOT_FOUND: "File not found",
  SOMETHING_WENT_WRONG: "Something went wrongs",
  DATABASE_ERROR: "Error while connecting to database",
  YOU_DO_NOT_HAVE_PERMISSION:
    "You don't have permission to perform this action",
};

export const UPLOAD_TYPES = {
  PROFILE_PHOTO: "profile-photo",
  PORTFOLIO: "portfolio",
  SELFIE: "selfie",
  REQUIREMENT: "requirement",
  //   CHAT: "chat",
  ADVERTISEMENT: "advertisement",
  REPORT_ISSUE: "report-issue",
};

export const INTEGERS = {
  ZERO: 0,
  ONE: 1,
  THREE: 3,
};

export const STRINGS = {
  FORWARD_SLASH: "/",
  HYPHEN: "-",
  FILE_URL: "file_url",
  APPLICATION: "application",
  TEXT: "text",
  FILE_ID: "file_id",
  SERVER_RUNNING_ON_PORT: "Server is running on port",
  VIDEO: "video",
  THUMBNAIL: "thumbnail",
  STYLIST: "stylist",
  COMPANY: "company",
  PNG_EXTENSION: ".png",
  DOT_FORWARD_SLASH: "./",
  THUMBNAIL_TIMING: ["00:00:01.000"],
  END: "end",
  RS256: "RS256",
  USER: "user",
  CONTENT_TYPE: "content-type",
  EXIT: "exit",
  SIGINT: "SIGINT",
  SIGUSR1: "SIGUSR1",
  SIGUSR2: "SIGUSR2",
  UNCAUGHT_EXCEPTION: "uncaughtException",
  SERVER_LISTENING_ON_PORT: "Server is listening on port",
};

export const EUREKA = {
  ID: "file-service",
  DEBUG: "debug",
  FILE_SERVICE_REGISTERED: "File service registered",
  STARTED: "started",
  HOST_MESSAGE: "eureka host  ",
  SERVICE_PATH: "/eureka/apps/",
  DATA_CENTER_NAME: "MyOwn",
  DATA_CENTER_CLASS: "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
};

export const MIME_TYPES = {
  IMAGE_PNG: "image/png",
};

const imageMimeTypes: {
  [key: string]: file_media_type;
} = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/bmp": "image",
  "image/webp": "image",
  "image/svg+xml": "image",
};

const videoMimeTypes: {
  [key: string]: file_media_type;
} = {
  "video/mp4": "video",
  "video/webm": "video",
  "video/x-msvideo": "video",
  "video/x-matroska": "video",
  "video/quicktime": "video",
  "video/x-ms-wmv": "video",
  "video/x-flv": "video",
  "video/3gpp": "video",
};

const audioMimeTypes: {
  [key: string]: file_media_type;
} = {
  "audio/mpeg": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "audio/aac": "audio",
  "audio/flac": "audio",
  "audio/midi": "audio",
};

const docMimeTypes: {
  [key: string]: file_media_type;
} = {
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "doc",
  "application/pdf": "pdf",
};

const textMimeTypes: {
  [key: string]: file_media_type;
} = {
  "text/plain": "text",
};

const imageMimeKeys = Object.keys(imageMimeTypes);
const videoMimeKeys = Object.keys(videoMimeTypes);
const audioMimeKeys = Object.keys(audioMimeTypes);
const docMimeKeys = Object.keys(docMimeTypes);
const textMimeKeys = Object.keys(textMimeTypes);

export const allMimeTypes: {
  [key: string]: file_media_type;
} = {
  ...imageMimeTypes,
  ...videoMimeTypes,
  ...audioMimeTypes,
  ...docMimeTypes,
  ...textMimeTypes,
};

export const allowedFileTypes: {
  [key: string]: string[];
} = {
  "profile-photo": [...imageMimeKeys],
  portfolio: [...imageMimeKeys, ...videoMimeKeys],
  selfie: [...imageMimeKeys],
  requirement: [...imageMimeKeys],
  advertisement: [...imageMimeKeys],
  "report-issue": [...imageMimeKeys],
  //   chat: [
  //     ...imageMimeKeys,
  //     ...videoMimeKeys,
  //     ...audioMimeKeys,
  //     ...docMimeKeys,
  //     ...textMimeKeys,
  //   ],
};

export const MAX_FILE_SIZE = 400 * 1024 * 1024; // 400 MB
export const MAX_TOTAL_FILE_SIZE = MAX_FILE_SIZE * 10; // 4 GB (400 MB * 10)

export const AUTH_SERVICE =
  "http://13.127.188.130:3001/auth";

export const JWKS_FOLDER = "/.well-known/jwks.json";
