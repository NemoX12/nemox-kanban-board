import {
  pgTable,
  serial,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(), // uuid_generate_v4()
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  reset_token: varchar("reset_token", { length: 255 }),
  reset_token_expiry: timestamp("reset_token_expiry", { withTimezone: false }),
  is_verified: boolean("is_verified").default(false),
  verification_token: varchar("verification_token", { length: 255 }),
  photo_url: text("photo_url"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  status: text("status").notNull(),
  creation_date: timestamp("creation_date", { withTimezone: true }).notNull(),
  completion_date: timestamp("completion_date", { withTimezone: true }),
  user_id: uuid("user_id").references(() => users.id),
});

export const email_logs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }),
  sent_at: timestamp("sent_at", { withTimezone: false }).defaultNow(),
});
