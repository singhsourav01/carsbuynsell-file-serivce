import prisma from "../configs/prisma.config";
import { generateSignedUrl } from "../configs/s3.config";
import { createFileType } from "../types/file.type";
import { queryHandler, getKeyFromUrl } from "../utils/helper";

const addSignedUrls = async (file: any) => {
  if (!file) return file;

  const fileKey = getKeyFromUrl(file.file_url);
  const signedUrl = await generateSignedUrl(fileKey);

  let signedThumbnailUrl = null;
  if (file.file_thumbnail_url) {
    const thumbnailKey = getKeyFromUrl(file.file_thumbnail_url);
    signedThumbnailUrl = await generateSignedUrl(thumbnailKey);
  }

  return {
    ...file,
    file_signed_url: signedUrl,
    file_signed_thumbnail_url: signedThumbnailUrl,
  };
};

class FileRepository {
  create = async (data: createFileType) => {
    return queryHandler(async () => await prisma.files.create({ data }));
  };

  getByIds = async (file_ids: string[]) => {
    const files = await queryHandler(
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

    // Add signed URLs to each file
    return await Promise.all(files.map(addSignedUrls));
  };

   getByUserId = async (user_id: string) => {
    const files = await queryHandler(
      async () =>
        await prisma.files.findMany({
          where: {
            file_uploaded_by_id: user_id,
            file_is_deleted: false,
          },
        })
    );

    // Add signed URLs to each file
    return await Promise.all(files.map(addSignedUrls));
  };

  getById = async (file_id: string) => {
    console.log(file_id, "inside repository");
    const file = await queryHandler(
      async () =>
        await prisma.files.findUnique({
          where: {
            file_id,
            // file_is_deleted: true,
          },
        })
    );

    // Add signed URL to file
    return await addSignedUrls(file);
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
