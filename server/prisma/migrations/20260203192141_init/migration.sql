/*
  Warnings:

  - Added the required column `teamId` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `task_list` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "task_list" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;
