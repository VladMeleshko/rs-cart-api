-- Cart and cart items tables

CREATE TABLE "Carts" (
  "id" uuid NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CART_PRIMARY_KEY" PRIMARY KEY ("id")
);

CREATE TABLE "Cart_items" (
  "id" uuid NOT NULL,
  "cart_id" uuid NOT NULL,
  "product_id" uuid NOT NULL,
  "count" INTEGER,
  CONSTRAINT "CART_ITEM_PRIMARY_KEY" PRIMARY KEY ("id")
);

ALTER TABLE "Cart_items" ADD CONSTRAINT "CART_ITEMS_CARTS_FOREIGN_KEY" FOREIGN KEY ("cart_id") REFERENCES "Carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Users table

CREATE TABLE "Users" (
  "id" uuid NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "password" TEXT,
  "cart_id" uuid,
  CONSTRAINT "USER_PRIMARY_KEY" PRIMARY KEY ("id"),
  CONSTRAINT "USER_CART_UNIQUE" UNIQUE ("cart_id")
);

ALTER TABLE "Users" ADD CONSTRAINT "USER_CART_FOREIGN_KEY" FOREIGN KEY ("cart_id") REFERENCES "Carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Orders table

CREATE TABLE "Orders" (
  "id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "cart_id" uuid NOT NULL,
  "items" JSONB NOT NULL,
  "payment" JSONB,
  "delivery" JSONB,
  "comments" TEXT,
  "status" TEXT NOT NULL,
  "total" INTEGER NOT NULL,
  CONSTRAINT "ORDER_PRIMARY_KEY" PRIMARY KEY ("id")
);

ALTER TABLE "Orders" ADD CONSTRAINT "ORDER_USER_FOREIGN_KEY" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "Orders" ADD CONSTRAINT "ORDER_CART_FOREIGN_KEY" FOREIGN KEY ("cart_id") REFERENCES "Carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
