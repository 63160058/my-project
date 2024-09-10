-- CreateTable
CREATE TABLE `export_doc` (
    `doc_id` VARCHAR(191) NOT NULL,
    `num_doc` INTEGER NOT NULL,
    `doc_date_at` DATETIME(3) NOT NULL,
    `doc_from` VARCHAR(191) NOT NULL,
    `doc_end` VARCHAR(191) NOT NULL,
    `doc_title` VARCHAR(191) NOT NULL,
    `doc_main` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`doc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
