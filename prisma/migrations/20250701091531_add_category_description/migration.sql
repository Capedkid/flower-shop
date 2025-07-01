/*
  Warnings:

  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN "description" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Review";
PRAGMA foreign_keys=on;
