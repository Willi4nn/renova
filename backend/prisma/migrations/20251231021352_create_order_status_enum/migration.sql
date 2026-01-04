/*
  Warnings:

  - You are about to alter the column `fabric_price_per_meter` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `fabric_meters` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `cost_fabric` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `cost_foam` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `cost_labor` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `cost_shipping` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `cost_other` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `total_cost` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `final_price` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `net_profit` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - The `delivery_date` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `collection_date` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'PAID');

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "fabric_price_per_meter" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "fabric_meters" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "cost_fabric" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "cost_foam" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "cost_labor" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "cost_shipping" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "cost_other" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "total_cost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "final_price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "net_profit" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "collection_date",
ADD COLUMN     "collection_date" DATE NOT NULL,
DROP COLUMN "delivery_date",
ADD COLUMN     "delivery_date" DATE,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");
