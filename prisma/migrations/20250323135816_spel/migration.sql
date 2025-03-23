/*
  Warnings:

  - You are about to drop the `SClass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SchoolDay" DROP CONSTRAINT "SchoolDay_sclassId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_sclassId_fkey";

-- DropTable
DROP TABLE "SClass";

-- CreateTable
CREATE TABLE "Sclass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sclass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sclass_name_key" ON "Sclass"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sclassId_fkey" FOREIGN KEY ("sclassId") REFERENCES "Sclass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolDay" ADD CONSTRAINT "SchoolDay_sclassId_fkey" FOREIGN KEY ("sclassId") REFERENCES "Sclass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
