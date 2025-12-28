-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "furniture_name" TEXT NOT NULL,
    "fabric_name" TEXT NOT NULL,
    "fabric_code" TEXT,
    "fabric_price_per_meter" DOUBLE PRECISION NOT NULL,
    "fabric_meters" DOUBLE PRECISION NOT NULL,
    "cost_fabric" DOUBLE PRECISION NOT NULL,
    "cost_foam" DOUBLE PRECISION NOT NULL,
    "cost_labor" DOUBLE PRECISION NOT NULL,
    "cost_shipping" DOUBLE PRECISION NOT NULL,
    "cost_other" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "net_profit" DOUBLE PRECISION NOT NULL,
    "collection_date" TEXT NOT NULL,
    "delivery_date" TEXT,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_client_id_idx" ON "orders"("client_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
