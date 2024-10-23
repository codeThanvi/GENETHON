/*
  Warnings:

  - You are about to drop the column `employeeId` on the `CallLog` table. All the data in the column will be lost.
  - You are about to drop the column `employeeUsername` on the `CallLog` table. All the data in the column will be lost.
  - Added the required column `Name` to the `CallLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CallLog" DROP CONSTRAINT "CallLog_employeeId_employeeUsername_fkey";

-- AlterTable
ALTER TABLE "CallLog" DROP COLUMN "employeeId",
DROP COLUMN "employeeUsername",
ADD COLUMN     "Name" TEXT NOT NULL;
