/*
  Warnings:

  - You are about to alter the column `D_comment` on the `officialdocument` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `officialdocument` MODIFY `D_comment` DATETIME(3) NOT NULL;
