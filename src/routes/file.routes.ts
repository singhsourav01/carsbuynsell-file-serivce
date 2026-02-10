import { fileMiddleWare } from "./../middlewares/file.middleware";
import express from "express";
import FileController from "../controllers/file.controller";
import { API_ENDPOINTS } from "../constants/app.constant";
import { authUser } from "../middlewares/auth.middleware";

const FileRoutes = express.Router();
const fileController = new FileController();

FileRoutes.route(API_ENDPOINTS.UPLOAD).post(
  fileMiddleWare,
  // authUser(),
  fileController.upload
);
FileRoutes.route(API_ENDPOINTS.GET).get(fileController.getByIds);
FileRoutes.route(API_ENDPOINTS.GET_BY_ID).get(fileController.getById);
FileRoutes.route(API_ENDPOINTS.DELETE).post(fileController.deleteByIds);
FileRoutes.route(API_ENDPOINTS.DELETE_BY_ID).delete(fileController.deleteById);

export default FileRoutes;
