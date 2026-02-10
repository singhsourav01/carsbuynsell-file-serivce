import { API_ENDPOINTS } from "../constants/app.constant";
import {
  SWAGGER,
  SWAGGER_ROUTES,
  bearerAuth,
} from "../constants/swagger.constant";
import { fileDocs, fileParameters, fileSchemas } from "./file.doc";

export const apiDoc = () => {
  return {
    openapi: SWAGGER.OPEN_API,
    info: {
      version: SWAGGER.VERSION,
      title: SWAGGER.TITLE,
    },
    servers: [
      {
        url: "/file",
      },
    ],
    paths: {
      [SWAGGER_ROUTES.UPLOAD]: {
        post: fileDocs.uploadFiles,
      },
      [SWAGGER_ROUTES.GET]: {
        post: fileDocs.getFiles,
      },

      [SWAGGER_ROUTES.GET_BY_ID]: {
        get: fileDocs.getByFileId,
      },
      [SWAGGER_ROUTES.DELETE]: {
        post: fileDocs.deleteFiles,
      },
      [SWAGGER_ROUTES.DELETE_BY_ID]: {
        delete: fileDocs.deleteFileById,
      },
    },
    components: {
      securitySchemes: { bearerAuth: bearerAuth },
      schemas: {
        uploadFilesBody: fileSchemas.uploadFilesBody,
        getFilesBody: fileSchemas.getFilesBody,
        deleteFilesBody: fileSchemas.deleteFilesBody,
      },
      parameters: {
        fileIdParameter: fileParameters.fileIdParameter,
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
};
