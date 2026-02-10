import { ApiError, errorHandler } from "common-microservices-utils";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import swaggerUi from "swagger-ui-express";
import {
  API_ENDPOINTS,
  API_ERRORS,
  BASE_URL,
  PORT,
  STRINGS,
} from "./constants/app.constant";
import { apiDoc } from "./docs/api.doc";
import FileRoutes from "./routes/file.routes";

dotenv.config();


const app = express();
const apiDocumentation = apiDoc();
const port = parseInt(process.env.PORT || "") || PORT;

app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

app.use(BASE_URL, FileRoutes);

app.use(
  API_ENDPOINTS.SWAGGER,
  swaggerUi.serve,
  swaggerUi.setup(apiDocumentation)
);

app.all(API_ENDPOINTS.STAR, () => {
  throw new ApiError(StatusCodes.NOT_FOUND, API_ERRORS.ROUTE_NOT_FOUND);
});

app.use(express.urlencoded({ extended: true }));

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.log("err", err);
  errorHandler(err, req, res, next);
});

app.listen(port, () => {
  console.log(`${STRINGS.SERVER_LISTENING_ON_PORT} ${port}`);
});

