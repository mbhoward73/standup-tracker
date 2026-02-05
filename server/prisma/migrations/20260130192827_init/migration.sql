/*
  Warnings:

  - The primary key for the `company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `company` table. All the data in the column will be lost.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `task` table. All the data in the column will be lost.
  - The primary key for the `task_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `task_list` table. All the data in the column will be lost.
  - The primary key for the `team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `team` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_taskListId_fkey";

-- DropForeignKey
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_userId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_companyId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_teamId_fkey";

-- AlterTable
ALTER TABLE "company" DROP CONSTRAINT "company_pkey",
DROP COLUMN "id",
ADD COLUMN     "companyId" SERIAL NOT NULL,
ADD CONSTRAINT "company_pkey" PRIMARY KEY ("companyId");

-- AlterTable
ALTER TABLE "task" DROP CONSTRAINT "task_pkey",
DROP COLUMN "description",
DROP COLUMN "id",
ADD COLUMN     "hoursEstimate" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "taskId" SERIAL NOT NULL,
ADD CONSTRAINT "task_pkey" PRIMARY KEY ("taskId");

-- AlterTable
ALTER TABLE "task_list" DROP CONSTRAINT "task_list_pkey",
DROP COLUMN "id",
ADD COLUMN     "taskListId" SERIAL NOT NULL,
ADD CONSTRAINT "task_list_pkey" PRIMARY KEY ("taskListId");

-- AlterTable
ALTER TABLE "team" DROP CONSTRAINT "team_pkey",
DROP COLUMN "id",
ADD COLUMN     "teamId" SERIAL NOT NULL,
ADD CONSTRAINT "team_pkey" PRIMARY KEY ("teamId");

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "team"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_list" ADD CONSTRAINT "task_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "task_list"("taskListId") ON DELETE RESTRICT ON UPDATE CASCADE;
