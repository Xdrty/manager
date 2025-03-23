/*
  Warnings:

  - Added the required column `homework` to the `TemplateLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateLesson" ADD COLUMN     "homework" TEXT NOT NULL;
