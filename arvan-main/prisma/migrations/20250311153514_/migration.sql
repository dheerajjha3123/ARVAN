/*
  Warnings:

  - A unique constraint covering the columns `[mobile_no]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile_no` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mobile_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_no_key" ON "User"("mobile_no");
