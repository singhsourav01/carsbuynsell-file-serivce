-- CreateTable
CREATE TABLE `files` (
    `file_id` VARCHAR(191) NOT NULL,
    `file_uploaded_by_id` VARCHAR(191) NULL,
    `file_upload_type` VARCHAR(191) NOT NULL,
    `file_is_deleted` BOOLEAN NOT NULL,
    `file_media_type` ENUM('image', 'video', 'audio', 'pdf', 'text', 'doc') NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `file_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `file_updated_at` DATETIME(3) NOT NULL,
    `file_thumbnail_url` VARCHAR(191) NULL,

    UNIQUE INDEX `files_file_url_key`(`file_url`),
    INDEX `files_file_id_idx`(`file_id`),
    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
