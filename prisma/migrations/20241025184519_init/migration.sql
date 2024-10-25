/*
  Warnings:

  - Added the required column `D_comment` to the `officialdocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `L_comment` to the `officialletter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `officialdocument` ADD COLUMN `D_comment` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `officialletter` ADD COLUMN `L_comment` VARCHAR(191) NOT NULL;
