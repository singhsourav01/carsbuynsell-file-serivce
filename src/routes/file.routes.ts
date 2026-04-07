import { fileMiddleWare } from "./../middlewares/file.middleware";
import express from "express";
import FileController from "../controllers/file.controller";
import { API_ENDPOINTS } from "../constants/app.constant";
import { authUser } from "../middlewares/auth.middleware";

const FileRoutes = express.Router();
const fileController = new FileController();

FileRoutes.route(API_ENDPOINTS.UPLOAD).post(
  fileMiddleWare,
  authUser(),
  fileController.upload
);
FileRoutes.route("/upload-listing-files").post(
  fileMiddleWare,
  authUser(),
  fileController.uploadListingFiles
);
FileRoutes.route(API_ENDPOINTS.GET).post(fileController.getByIds);
FileRoutes.route(API_ENDPOINTS.GET_BUY_USER_ID).get(fileController.getByUserId);
FileRoutes.route(API_ENDPOINTS.GET_BY_LISTING_ID).get(
  fileController.getByListingId
);
FileRoutes.route(API_ENDPOINTS.GET_BY_ID).get(fileController.getById);
FileRoutes.route(API_ENDPOINTS.DELETE).post(fileController.deleteByIds);
FileRoutes.route(API_ENDPOINTS.DELETE_BY_ID).delete(fileController.deleteById);

export default FileRoutes;
