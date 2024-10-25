/*
  Warnings:

  - Added the required column `D_type` to the `officialdocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `L_type` to the `officialletter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `officialdocument` ADD COLUMN `D_type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `officialletter` ADD COLUMN `L_type` VARCHAR(191) NOT NULL;
