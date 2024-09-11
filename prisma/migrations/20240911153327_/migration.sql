/*
  Warnings:

  - The primary key for the `export_doc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `doc_id` on the `export_doc` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `export_doc` DROP PRIMARY KEY,
    MODIFY `doc_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`doc_id`);
