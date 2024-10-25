/*
  Warnings:

  - Added the required column `D_to` to the `officialdocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `L_to` to the `officialletter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `officialdocument` ADD COLUMN `D_to` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `officialletter` ADD COLUMN `L_to` VARCHAR(191) NOT NULL;
