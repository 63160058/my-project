/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `User_id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `officialdocument` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `officialletter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `postnotice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `P_number` on the `postnotice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[User_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[D_id]` on the table `officialdocument` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[L_id]` on the table `officialletter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `officialdocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `officialletter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `postnotice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `User_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `officialdocument` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `officialletter` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `postnotice` DROP PRIMARY KEY,
    DROP COLUMN `P_number`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_User_id_key` ON `User`(`User_id`);

-- CreateIndex
CREATE UNIQUE INDEX `officialdocument_D_id_key` ON `officialdocument`(`D_id`);

-- CreateIndex
CREATE UNIQUE INDEX `officialletter_L_id_key` ON `officialletter`(`L_id`);
