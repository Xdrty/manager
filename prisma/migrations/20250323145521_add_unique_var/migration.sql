/*
  Warnings:

  - A unique constraint covering the columns `[dayOfWeek,sclassId]` on the table `TemplateDay` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemplateDay_dayOfWeek_sclassId_key" ON "TemplateDay"("dayOfWeek", "sclassId");
