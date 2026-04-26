-- AlterTable: Product soft delete
ALTER TABLE "Product" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "Product_deletedAt_idx" ON "Product"("deletedAt");

-- CreateTable: ProductVariant
CREATE TABLE "ProductVariant" (
    "id"        TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color"     TEXT NOT NULL,
    "size"      TEXT NOT NULL,
    "stock"     INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_color_size_key"
    ON "ProductVariant"("productId", "color", "size");
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- AddForeignKey
ALTER TABLE "ProductVariant"
    ADD CONSTRAINT "ProductVariant_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
