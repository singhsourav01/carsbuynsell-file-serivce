import { Prisma } from "@prisma/client";
import prisma from "../configs/prisma.config";

export type createFileType = Prisma.Args<typeof prisma.files, "create">["data"];
