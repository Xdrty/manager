/*
  Warnings:

  - You are about to drop the column `classId` on the `SchoolDay` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sclassId` to the `SchoolDay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sclassId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_schoolDayId_fkey";

-- DropForeignKey
ALTER TABLE "SchoolDay" DROP CONSTRAINT "SchoolDay_classId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_classId_fkey";

-- AlterTable
ALTER TABLE "SchoolDay" DROP COLUMN "classId",
ADD COLUMN     "sclassId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "classId",
ADD COLUMN     "sclassId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Class";

-- CreateTable
CREATE TABLE "SClass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SClass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SClass_name_key" ON "SClass"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sclassId_fkey" FOREIGN KEY ("sclassId") REFERENCES "SClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolDay" ADD CONSTRAINT "SchoolDay_sclassId_fkey" FOREIGN KEY ("sclassId") REFERENCES "SClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_schoolDayId_fkey" FOREIGN KEY ("schoolDayId") REFERENCES "SchoolDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
