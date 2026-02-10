import { UPLOAD_TYPES, STRINGS } from "../constants/app.constant";
import {
  SWAGGER_TAGS,
  SWAGGER_DESCRIPTIONS,
  CONTENT_TYPES,
  SWAGGER_REFS,
  RES_TYPES,
  REQUEST_FIELDS,
  API_PARAMETERS,
  PARAMETER_TYPES,
} from "../constants/swagger.constant";

const uploadFiles = {
  tags: [SWAGGER_TAGS.FILES],
  description: SWAGGER_DESCRIPTIONS.UPLOAD_FILES_ON_SERVER,
  requestBody: {
    content: {
      [CONTENT_TYPES.FORM_DATA]: {
        schema: {
          $ref: SWAGGER_REFS.UPLOAD_FILE_BODY,
        },
      },
    },
    required: true,
  },
  responses: {},
};

const getByFileId = {
  tags: [SWAGGER_TAGS.FILES],
  description: SWAGGER_DESCRIPTIONS.DELETE_FILES_FROM_SERVER,
  parameters: [
    {
      $ref: SWAGGER_REFS.FILE_ID_PARAMETER,
    },
  ],
  responses: {},
};

const getFiles = {
  tags: [SWAGGER_TAGS.FILES],
  description: SWAGGER_DESCRIPTIONS.GET_FILE_INFORMATION,
  requestBody: {
    content: {
      [CONTENT_TYPES.JSON_DATA]: {
        schema: {
          $ref: SWAGGER_REFS.GET_FILE_BODY,
        },
      },
    },
    required: true,
  },
  responses: {},
};

const deleteFiles = {
  tags: [SWAGGER_TAGS.FILES],
  description: SWAGGER_DESCRIPTIONS.DELETE_FILES_FROM_SERVER,
  requestBody: {
    content: {
      [CONTENT_TYPES.JSON_DATA]: {
        schema: {
          $ref: SWAGGER_REFS.DELETE_FILE_BODY,
        },
      },
    },
    required: true,
  },
  responses: {},
};

const deleteFileById = {
  tags: [SWAGGER_TAGS.FILES],
  description: SWAGGER_DESCRIPTIONS.DELETE_FILES_FROM_SERVER,
  parameters: [
    {
      $ref: SWAGGER_REFS.FILE_ID_PARAMETER,
    },
  ],
  responses: {},
};

const uploadFilesBody = {
  type: RES_TYPES.OBJECT,
  properties: {
    files: {
      type: RES_TYPES.ARRAY,
      description: SWAGGER_DESCRIPTIONS.ARRAY_OF_FILES,
      items: {
        type: RES_TYPES.STRING,
        format: RES_TYPES.BINARY,
      },
    },
    type: {
      type: RES_TYPES.STRING,
      enum: Object.values(UPLOAD_TYPES),
      description: SWAGGER_DESCRIPTIONS.FOR_WHICH_TYPE_UPLOADING,
    },
  },
  required: [REQUEST_FIELDS.FILES, REQUEST_FIELDS.TYPE],
};

const deleteFilesBody = {
  type: RES_TYPES.OBJECT,
  properties: {
    file_ids: {
      type: RES_TYPES.ARRAY,
      description: SWAGGER_DESCRIPTIONS.FILES_IDS_NEED_TO_GET,
      items: {
        type: RES_TYPES.STRING,
        example: STRINGS.FILE_ID,
      },
    },
  },
  required: [REQUEST_FIELDS.FILES],
};

const getFilesBody = {
  type: RES_TYPES.OBJECT,
  properties: {
    file_ids: {
      type: RES_TYPES.ARRAY,
      description: SWAGGER_DESCRIPTIONS.FILES_IDS_NEED_TO_GET,
      items: {
        type: RES_TYPES.STRING,
        example: STRINGS.FILE_ID,
      },
    },
  },
  required: [REQUEST_FIELDS.FILE_IDS],
};

const fileIdParameter = {
  name: API_PARAMETERS.FILE_ID,
  in: PARAMETER_TYPES.PATH,
  required: true,
  schema: {
    type: RES_TYPES.STRING,
  },
};

export const fileDocs = {
  deleteFiles,
  getFiles,
  uploadFiles,
  getByFileId,
  deleteFileById,
};

export const fileSchemas = { uploadFilesBody, getFilesBody, deleteFilesBody };

export const fileParameters = { fileIdParameter };
