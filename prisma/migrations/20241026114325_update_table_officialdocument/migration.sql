/*
  Warnings:

  - You are about to alter the column `D_time` on the `officialdocument` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `officialdocument` MODIFY `D_time` DATETIME(3) NOT NULL,
    MODIFY `D_comment` VARCHAR(191) NOT NULL;
