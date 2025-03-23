/*
  Warnings:

  - A unique constraint covering the columns `[sclassId,date]` on the table `SchoolDay` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SchoolDay" ALTER COLUMN "date" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "TemplateDay" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "sclassId" INTEGER NOT NULL,

    CONSTRAINT "TemplateDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateLesson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "templateDayId" INTEGER NOT NULL,

    CONSTRAINT "TemplateLesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolDay_sclassId_date_key" ON "SchoolDay"("sclassId", "date");

-- AddForeignKey
ALTER TABLE "TemplateDay" ADD CONSTRAINT "TemplateDay_sclassId_fkey" FOREIGN KEY ("sclassId") REFERENCES "Sclass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateLesson" ADD CONSTRAINT "TemplateLesson_templateDayId_fkey" FOREIGN KEY ("templateDayId") REFERENCES "TemplateDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
