import prisma from "../configs/prisma.config";
import { createFileType } from "../types/file.type";
import { queryHandler } from "../utils/helper";

class FileRepository {
  create = async (data: createFileType) => {
    return queryHandler(async () => await prisma.files.create({ data }));
  };

  getByIds = async (file_ids: string[]) => {
    return queryHandler(
      async () =>
        await prisma.files.findMany({
          where: {
            file_id: {
              in: file_ids,
            },
            file_is_deleted: false,
          },
        })
    );
  };

  getById = async (file_id: string) => {
    console.log(file_id, "inside repository");
    return queryHandler(
      async () =>
        await prisma.files.findUnique({
          where: {
            file_id,
            // file_is_deleted: true,
          },
        })
    );
  };

  deleteMany = async (file_ids: string[]) => {
    return queryHandler(
      async () =>
        await prisma.files.updateMany({
          where: {
            file_id: {
              in: file_ids,
            },
          },
          data: { file_is_deleted: true },
        })
    );
  };

  deleteById = async (file_id: string) => {
    return queryHandler(
      async () =>
        await prisma.files.update({
          where: { file_id },
          data: { file_is_deleted: true },
        })
    );
  };
}

export default FileRepository;
