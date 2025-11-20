CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100),
	"quantity" integer DEFAULT 1
);
