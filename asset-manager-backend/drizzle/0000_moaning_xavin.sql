CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100),
	"quantity" integer DEFAULT 1
);


ALTER TABLE "assets"
ADD COLUMN "purchase_cost" NUMERIC(10,2);

ALTER TABLE "assets"
ADD COLUMN "purchase_date" DATE;

ALTER TABLE "assets"
ADD COLUMN "useful_life_years" INTEGER DEFAULT 5;

ALTER TABLE "assets"
ADD COLUMN "salvage_value" NUMERIC(10,2) DEFAULT 0;