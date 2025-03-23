/*
  Warnings:

  - Added the required column `serialNumber` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `TemplateLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "serialNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TemplateLesson" ADD COLUMN     "serialNumber" INTEGER NOT NULL;
