-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('SERVICE', 'PRODUCT');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessType" "BusinessType" NOT NULL DEFAULT 'SERVICE';
