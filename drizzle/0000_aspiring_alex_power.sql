CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"raw_user_meta_data" jsonb NOT NULL
);
