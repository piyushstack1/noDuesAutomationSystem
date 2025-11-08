/*
  Warnings:

  - A unique constraint covering the columns `[student_id]` on the table `NoDuesRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[request_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "request_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."Query" (
    "query_id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "request_id" INTEGER NOT NULL,
    "track_id" INTEGER,
    "approving_unit" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "Query_pkey" PRIMARY KEY ("query_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NoDuesRequest_student_id_key" ON "public"."NoDuesRequest"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_request_id_key" ON "public"."Student"("request_id");

-- AddForeignKey
ALTER TABLE "public"."Query" ADD CONSTRAINT "Query_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Query" ADD CONSTRAINT "Query_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."NoDuesRequest"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Query" ADD CONSTRAINT "Query_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."Track"("track_id") ON DELETE SET NULL ON UPDATE CASCADE;
