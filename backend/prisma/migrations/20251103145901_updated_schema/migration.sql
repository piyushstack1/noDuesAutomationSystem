/*
  Warnings:

  - A unique constraint covering the columns `[scholar_no]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `last_updated_at` to the `NoDuesRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `required_docs` to the `NoDuesRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitted_docs` to the `NoDuesRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aadhar_passport` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_account_no` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cgpa` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `degree` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documents` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ifsc_code` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile_no` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_picture` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scholar_no` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `course` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NoDuesRequest" ADD COLUMN     "accounts_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "department_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hostel_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "library_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "proctor_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "required_docs" JSONB NOT NULL,
ADD COLUMN     "sports_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submitted_docs" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "aadhar_passport" TEXT NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "bank_account_no" TEXT NOT NULL,
ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "cgpa" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "degree" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "documents" JSONB NOT NULL,
ADD COLUMN     "ifsc_code" TEXT NOT NULL,
ADD COLUMN     "is_hosteler" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mobile_no" TEXT NOT NULL,
ADD COLUMN     "profile_picture" TEXT NOT NULL,
ADD COLUMN     "room_no" TEXT,
ADD COLUMN     "scholar_no" TEXT NOT NULL,
ALTER COLUMN "course" SET NOT NULL;

-- CreateIndex
CREATE INDEX "NoDuesRequest_status_idx" ON "NoDuesRequest"("status");

-- CreateIndex
CREATE INDEX "NoDuesRequest_submitted_at_idx" ON "NoDuesRequest"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "Student_scholar_no_key" ON "Student"("scholar_no");

-- CreateIndex
CREATE INDEX "Student_scholar_no_idx" ON "Student"("scholar_no");

-- CreateIndex
CREATE INDEX "Student_email_idx" ON "Student"("email");
