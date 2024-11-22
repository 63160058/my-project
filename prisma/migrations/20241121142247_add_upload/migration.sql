/*
  Warnings:

  - Added the required column `D_File` to the `officialdocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `officialdocument` ADD COLUMN `D_File` VARCHAR(191) NOT NULL;
