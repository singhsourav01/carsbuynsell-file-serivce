export const SWAGGER = {
  OPEN_API: "3.0.1",
  VERSION: "1.0.0",
  TITLE: "File upload service API - Documentation",
};

export const SWAGGER_TAGS = {
  FILES: "Files",
  DELETE_FILES: "Delete Files",
  GET_FILES: "Get Files",
};

export const SWAGGER_ROUTES = {
  UPLOAD: "/upload",
  GET: "/get",
  GET_BY_LISTING_ID: "/get-by-listing-id",
  GET_BY_ID: "/get/{file_id}",
  DELETE: "/delete",
  DELETE_BY_ID: "/delete/{file_id}",
};

export const SWAGGER_DESCRIPTIONS = {
  UPLOAD_FILES_ON_SERVER: "Upload files on the server",
  DELETE_FILES_FROM_SERVER: "Delete files from the server",
  GET_FILE_INFORMATION: "Get files information",
  ARRAY_OF_FILES: "Array of files",
  ID_NOT_REQUIRED_IN_CASE_REPORT_ISSUE:
    "Not required in case uploading for type {report issue} other wise required",
  FOR_WHICH_TYPE_UPLOADING: "For which type you are uploading",
  FILES_IDS_NEED_TO_GET: "Array of file ids that need to get",
};

export const SWAGGER_REFS = {
  UPLOAD_FILE_BODY: "#/components/schemas/uploadFilesBody",
  DELETE_FILE_BODY: "#/components/schemas/deleteFilesBody",
  GET_FILE_BODY: "#/components/schemas/getFilesBody",
  FILE_ID_PARAMETER: "#/components/parameters/fileIdParameter",
  LISTING_ID_PARAMETER: "#/components/parameters/listingIdParameter",
};
export const RES_TYPES = {
  OBJECT: "object",
  NUMBER: "number",
  ARRAY: "array",
  STRING: "string",
  BOOLEAN: "boolean",
  BINARY: "binary",
};

export const REQUEST_FIELDS = {
  FILES: "files",
  TYPE: "type",
  FILE_IDS: "file_ids",
};

export const CONTENT_TYPES = {
  FORM_DATA: "multipart/form-data",
  JSON_DATA: "application/json",
  TEXT_PLAIN: "text/plain",
};

export const bearerAuth = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
};

export const API_PARAMETERS = {
  FILE_ID: "file_id",
  LISTING_ID: "listing_id",
};

export const PARAMETER_TYPES = {
  PATH: "path",
  QUERY: "query",
};
