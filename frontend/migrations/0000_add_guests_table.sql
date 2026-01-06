CREATE TABLE "guests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "guests_name_unique" UNIQUE("name")
);
