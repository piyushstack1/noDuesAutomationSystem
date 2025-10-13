/*
  Warnings:

  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department_id` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `FinalApproval` table. All the data in the column will be lost.
  - The `final_status` column on the `FinalApproval` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Hostel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hostel_id` on the `Hostel` table. All the data in the column will be lost.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `hostel_id` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `roll_no` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `Track` table. All the data in the column will be lost.
  - The `status` column on the `Track` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Library` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proctor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sports` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[request_id]` on the table `FinalApproval` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department_code` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `head` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_id` to the `FinalApproval` table without a default value. This is not possible if the table is not empty.
  - Made the column `issued_at` on table `FinalApproval` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `hostel_no` to the `Hostel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admission_date` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_id` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Added the required column `step_number` to the `Track` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `unit_type` on the `Track` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."FinalApproval" DROP CONSTRAINT "FinalApproval_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_department_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_hostel_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Track" DROP CONSTRAINT "Track_student_id_fkey";

-- DropIndex
DROP INDEX "public"."Department_name_key";

-- DropIndex
DROP INDEX "public"."Hostel_name_key";

-- DropIndex
DROP INDEX "public"."Student_roll_no_key";

-- AlterTable
ALTER TABLE "public"."Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "department_id",
ADD COLUMN     "department_code" TEXT NOT NULL,
ADD COLUMN     "head" TEXT NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("department_code");

-- AlterTable
ALTER TABLE "public"."FinalApproval" DROP COLUMN "student_id",
ADD COLUMN     "request_id" INTEGER NOT NULL,
DROP COLUMN "final_status",
ADD COLUMN     "final_status" TEXT NOT NULL DEFAULT 'Pending',
ALTER COLUMN "issued_at" SET NOT NULL,
ALTER COLUMN "issued_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Hostel" DROP CONSTRAINT "Hostel_pkey",
DROP COLUMN "hostel_id",
ADD COLUMN     "hostel_no" TEXT NOT NULL,
ADD COLUMN     "warden" TEXT,
ADD CONSTRAINT "Hostel_pkey" PRIMARY KEY ("hostel_no");

-- AlterTable
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "created_at",
DROP COLUMN "department_id",
DROP COLUMN "hostel_id",
DROP COLUMN "roll_no",
DROP COLUMN "year",
ADD COLUMN     "admission_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "department_code" TEXT,
ADD COLUMN     "hostel_no" TEXT,
ADD COLUMN     "passing_date" TIMESTAMP(3),
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "student_id" DROP DEFAULT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ALTER COLUMN "course" DROP NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id");
DROP SEQUENCE "Student_student_id_seq";

-- AlterTable
ALTER TABLE "public"."Track" DROP COLUMN "student_id",
ADD COLUMN     "request_id" INTEGER NOT NULL,
ADD COLUMN     "staff_id" INTEGER,
ADD COLUMN     "step_number" INTEGER NOT NULL,
DROP COLUMN "unit_type",
ADD COLUMN     "unit_type" TEXT NOT NULL,
ALTER COLUMN "unit_id" DROP NOT NULL,
ALTER COLUMN "unit_id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending';

-- DropTable
DROP TABLE "public"."Accounts";

-- DropTable
DROP TABLE "public"."Library";

-- DropTable
DROP TABLE "public"."Proctor";

-- DropTable
DROP TABLE "public"."Sports";

-- DropEnum
DROP TYPE "public"."FinalStatus";

-- DropEnum
DROP TYPE "public"."TrackStatus";

-- DropEnum
DROP TYPE "public"."UnitType";

-- CreateTable
CREATE TABLE "public"."CentralUnit" (
    "unit_id" SERIAL NOT NULL,
    "unit_type" TEXT NOT NULL,

    CONSTRAINT "CentralUnit_pkey" PRIMARY KEY ("unit_id")
);

-- CreateTable
CREATE TABLE "public"."Staff" (
    "staff_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "unit_type" TEXT NOT NULL,
    "unit_id" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "public"."NoDuesRequest" (
    "request_id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "student_id" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,

    CONSTRAINT "NoDuesRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CentralUnit_unit_type_key" ON "public"."CentralUnit"("unit_type");

-- CreateIndex
CREATE UNIQUE INDEX "FinalApproval_request_id_key" ON "public"."FinalApproval"("request_id");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "public"."Department"("department_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_hostel_no_fkey" FOREIGN KEY ("hostel_no") REFERENCES "public"."Hostel"("hostel_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NoDuesRequest" ADD CONSTRAINT "NoDuesRequest_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NoDuesRequest" ADD CONSTRAINT "NoDuesRequest_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."NoDuesRequest"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."Staff"("staff_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinalApproval" ADD CONSTRAINT "FinalApproval_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."NoDuesRequest"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;
