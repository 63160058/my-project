/*
  Warnings:

  - The primary key for the `export_doc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `remark` to the `export_doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `L_num` to the `officialletter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `export_doc` DROP PRIMARY KEY,
    ADD COLUMN `remark` DATETIME(3) NOT NULL,
    MODIFY `doc_id` VARCHAR(191) NOT NULL,
    MODIFY `num_doc` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`doc_id`);

-- AlterTable
ALTER TABLE `officialletter` ADD COLUMN `L_num` VARCHAR(191) NOT NULL;
