import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

const id = () => uuid("id").primaryKey().defaultRandom();
const timestampTz = (name: string) => timestamp(name, { withTimezone: true });

export const section = pgTable("section", {
  id: id(),
  title: text("title").notNull(),
  position: integer("position").notNull(),
  createdAt: timestampTz("created_at").notNull().defaultNow(),
});

export const item = pgTable(
  "item",
  {
    id: id(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => section.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    done: boolean("done").notNull().default(false),
    position: integer("position").notNull(),
    createdAt: timestampTz("created_at").notNull().defaultNow(),
  },
  (table) => [index("item_section_id_idx").on(table.sectionId)],
);

export const session = pgTable(
  "session",
  {
    id: id(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestampTz("expires_at").notNull(),
    createdAt: timestampTz("created_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("session_token_hash_idx").on(table.tokenHash)],
);

export const loginAttempt = pgTable(
  "login_attempt",
  {
    id: id(),
    ip: text("ip").notNull(),
    success: boolean("success").notNull(),
    attemptedAt: timestampTz("attempted_at").notNull().defaultNow(),
  },
  (table) => [index("login_attempt_ip_attempted_at_idx").on(table.ip, table.attemptedAt)],
);
