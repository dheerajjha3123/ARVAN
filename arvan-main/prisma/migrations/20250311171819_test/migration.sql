/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "isPhoneNoVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNoVerified" TIMESTAMP(3);
