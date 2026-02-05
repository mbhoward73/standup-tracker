/*
  Warnings:

  - Added the required column `companyId` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `task_list` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "task_list" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "team" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
