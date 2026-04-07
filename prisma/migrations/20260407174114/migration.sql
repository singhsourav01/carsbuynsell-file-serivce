-- AlterTable
ALTER TABLE `files` ADD COLUMN `file_listing_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `files_file_listing_id_idx` ON `files`(`file_listing_id`);
