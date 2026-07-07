-- AlterEnum
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
CREATE TYPE "AppointmentStatus" AS ENUM ('NEW', 'ACCEPTED', 'FINISHED');
ALTER TABLE "Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus" USING (
  CASE "status"::text
    WHEN 'PENDING' THEN 'NEW'
    WHEN 'CONFIRMED' THEN 'ACCEPTED'
    WHEN 'CANCELLED' THEN 'NEW'
    ELSE "status"::text
  END
)::"AppointmentStatus";
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'NEW';
DROP TYPE "AppointmentStatus_old";

-- CreateTable
CREATE TABLE "AppointmentNote" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentNote_appointmentId_idx" ON "AppointmentNote"("appointmentId");

-- AddForeignKey
ALTER TABLE "AppointmentNote" ADD CONSTRAINT "AppointmentNote_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
