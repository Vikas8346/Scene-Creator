CREATE TABLE IF NOT EXISTS "midwestcon_user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"vechain_address" varchar(42)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "midwestcon_user_profiles" ADD CONSTRAINT "midwestcon_user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
