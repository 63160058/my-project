/*
  Warnings:

  - You are about to drop the column `D_File` on the `officialdocument` table. All the data in the column will be lost.
  - You are about to alter the column `D_date` on the `officialdocument` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `D_time` on the `officialdocument` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `officialdocument` DROP COLUMN `D_File`,
    ADD COLUMN `D_file` VARCHAR(191) NULL,
    MODIFY `D_date` DATETIME(3) NOT NULL,
    MODIFY `D_time` DATETIME(3) NOT NULL;
