-- CreateTable
CREATE TABLE `User` (
    `User_id` VARCHAR(191) NOT NULL,
    `User_email` VARCHAR(191) NOT NULL,
    `User_fname` VARCHAR(191) NULL,
    `User_lname` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_User_email_key`(`User_email`),
    PRIMARY KEY (`User_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `officialdocument` (
    `D_id` VARCHAR(191) NOT NULL,
    `D_date` DATETIME(3) NOT NULL,
    `D_from` VARCHAR(191) NOT NULL,
    `D_story` VARCHAR(191) NOT NULL,
    `D_time` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`D_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `officialletter` (
    `L_id` VARCHAR(191) NOT NULL,
    `L_date` DATETIME(3) NOT NULL,
    `L_from` VARCHAR(191) NOT NULL,
    `L_story` VARCHAR(191) NOT NULL,
    `L_time` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`L_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postnotice` (
    `P_number` VARCHAR(191) NOT NULL,
    `P_institute` INTEGER NOT NULL,
    `P_id` VARCHAR(191) NOT NULL,
    `P_date1` DATETIME(3) NOT NULL,
    `P_story` VARCHAR(191) NOT NULL,
    `P_website` VARCHAR(191) NOT NULL,
    `P_date2` DATETIME(3) NOT NULL,
    `P_time` VARCHAR(191) NOT NULL,
    `P_endorser` VARCHAR(191) NOT NULL,
    `P_comment` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`P_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
