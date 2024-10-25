/*
  Warnings:

  - You are about to drop the column `D_num` on the `officialdocument` table. All the data in the column will be lost.
  - You are about to drop the column `L_num` on the `officialletter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `officialdocument` DROP COLUMN `D_num`;

-- AlterTable
ALTER TABLE `officialletter` DROP COLUMN `L_num`;
