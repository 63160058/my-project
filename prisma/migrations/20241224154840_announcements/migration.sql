-- CreateTable
CREATE TABLE `announcements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `A_date1` DATETIME(3) NOT NULL,
    `A_Agency` VARCHAR(191) NOT NULL,
    `A_Book_number` VARCHAR(191) NOT NULL,
    `A_date2` DATETIME(3) NOT NULL,
    `A_Subject` VARCHAR(191) NOT NULL,
    `A_date3` DATETIME(3) NOT NULL,
    `A_endorser1` VARCHAR(191) NOT NULL,
    `A_date4` DATETIME(3) NOT NULL,
    `A_endorser2` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
