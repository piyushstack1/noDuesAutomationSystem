-- CreateEnum
CREATE TYPE "public"."UnitType" AS ENUM ('Department', 'Hostel', 'Library', 'Accounts', 'Proctor', 'Sports');

-- CreateEnum
CREATE TYPE "public"."TrackStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Query');

-- CreateEnum
CREATE TYPE "public"."FinalStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateTable
CREATE TABLE "public"."Department" (
    "department_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "public"."Hostel" (
    "hostel_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("hostel_id")
);

-- CreateTable
CREATE TABLE "public"."Library" (
    "library_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("library_id")
);

-- CreateTable
CREATE TABLE "public"."Accounts" (
    "account_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "public"."Proctor" (
    "proctor_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Proctor_pkey" PRIMARY KEY ("proctor_id")
);

-- CreateTable
CREATE TABLE "public"."Sports" (
    "sports_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sports_pkey" PRIMARY KEY ("sports_id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "student_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "roll_no" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "department_id" INTEGER,
    "hostel_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "admin_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "public"."Track" (
    "track_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "unit_type" "public"."UnitType" NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "status" "public"."TrackStatus" NOT NULL DEFAULT 'Pending',
    "remarks" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("track_id")
);

-- CreateTable
CREATE TABLE "public"."FinalApproval" (
    "approval_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "final_status" "public"."FinalStatus" NOT NULL DEFAULT 'Pending',
    "issued_at" TIMESTAMP(3),

    CONSTRAINT "FinalApproval_pkey" PRIMARY KEY ("approval_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "public"."Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_name_key" ON "public"."Hostel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Library_name_key" ON "public"."Library"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_name_key" ON "public"."Accounts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Proctor_name_key" ON "public"."Proctor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sports_name_key" ON "public"."Sports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_roll_no_key" ON "public"."Student"("roll_no");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "public"."Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."Department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "public"."Hostel"("hostel_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinalApproval" ADD CONSTRAINT "FinalApproval_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FinalApproval" ADD CONSTRAINT "FinalApproval_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."Admin"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;
