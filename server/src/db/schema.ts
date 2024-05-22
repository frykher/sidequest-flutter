import { relations } from "drizzle-orm";
import { integer, text, pgTable, serial, boolean, numeric } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  universityName: text("university_name").notNull(),
  balance: numeric("balance", { precision: 2 }).default("0").notNull(),
  experience: integer("experience").default(1).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  hostedQuests: many(quest, { relationName: "requester" }),
  acceptedQuests: many(quest, { relationName: "worker" }),
}))

export const quest = pgTable("quest", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  requesterId: text("requester_id").notNull(),
  pay: numeric("pay", { precision: 2 }).notNull(),
  location: text("location").notNull(),
  experienceRequired: integer("experience_required").notNull(),
  phoneNumber: text("phone_number").notNull(),
  workerId: text("worker_id").references(() => user.id),
  completed: boolean("completed").default(false).notNull(),
});

export const questRelations = relations(quest, ({ one, many }) => ({
  requester: one(user, {
    fields: [quest.requesterId],
    references: [user.id],
    relationName: "requester",
  }),
  worker: one(user, {
    fields: [quest.workerId],
    references: [user.id],
    relationName: "worker",
  })
}))


