-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENT', 'FIXED');

-- AlterTable: User.tcKimlik
ALTER TABLE "User" ADD COLUMN "tcKimlik" TEXT;

-- AlterTable: Address.tcKimlik
ALTER TABLE "Address" ADD COLUMN "tcKimlik" TEXT;

-- AlterTable: Order new fields
ALTER TABLE "Order" ADD COLUMN "subtotal"        DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "discount"        DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN "couponCode"      TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingCarrier" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingNumber"  TEXT;

-- CreateTable: Coupon
CREATE TABLE "Coupon" (
    "id"          TEXT NOT NULL,
    "code"        TEXT NOT NULL,
    "description" TEXT,
    "type"        "CouponType" NOT NULL,
    "value"       DOUBLE PRECISION NOT NULL,
    "minSubtotal" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "usageLimit"  INTEGER,
    "usedCount"   INTEGER NOT NULL DEFAULT 0,
    "startsAt"    TIMESTAMP(3),
    "expiresAt"   TIMESTAMP(3),
    "active"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
