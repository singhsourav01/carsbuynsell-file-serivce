-- DropIndex
DROP INDEX `files_file_url_key` ON `files`;

-- AlterTable
ALTER TABLE `files` MODIFY `file_url` LONGTEXT NOT NULL;
