/*
  Warnings:

  - Added the required column `A_date5` to the `announcements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `announcements` ADD COLUMN `A_date5` DATETIME(3) NOT NULL;
