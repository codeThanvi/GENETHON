/*
  Warnings:

  - A unique constraint covering the columns `[id,username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeUsername` to the `CallLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CallLog" DROP CONSTRAINT "CallLog_employeeId_fkey";

-- AlterTable
ALTER TABLE "CallLog" ADD COLUMN     "employeeUsername" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_id_username_key" ON "User"("id", "username");

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_employeeId_employeeUsername_fkey" FOREIGN KEY ("employeeId", "employeeUsername") REFERENCES "User"("id", "username") ON DELETE RESTRICT ON UPDATE CASCADE;
