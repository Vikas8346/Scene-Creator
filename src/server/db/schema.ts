import {
  pgTableCreator,
  uuid,
  pgSchema,
  varchar,
  jsonb,
  text,
  timestamp,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const createTable = pgTableCreator((name) => `midwestcon_${name}`);

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email").notNull(),
  raw_user_meta_data: jsonb("raw_user_meta_data").notNull(),
});

export const userProfiles = createTable("user_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  veChainAddress: varchar("vechain_address", { length: 42 }),
});

export const userRelations = relations(users, ({ many, one }) => ({
  scenes: many(scenes),
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
}));

export const scenes = createTable("scenes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  imageHash: text("image_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  date: date("date"),
  rewardPending: boolean("reward_pending").default(false),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const sceneRelations = relations(scenes, ({ one }) => ({
  user: one(users, {
    fields: [scenes.userId],
    references: [users.id],
  }),
}));
