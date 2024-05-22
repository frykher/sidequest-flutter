import { z } from "zod";
import db from "./db/drizzle";
import { quest, user } from "./db/schema";
import { publicProcedure, router } from "./trpc";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const insertQuestSchema = createInsertSchema(quest);

const appRouter = router({
  questList: publicProcedure.query(async () => {
    const quests = await db.select().from(quest);
    return quests;
  }),
  hostedQuestsList: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const hostedQuests = await db.query.quest.findMany({
      where: eq(quest.requesterId, input),
    });
    return hostedQuests || [];
  }),
  workedQuestsList: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const workedQuests = await db.query.quest.findMany({
      where: eq(quest.workerId, input),
    });
    return workedQuests || [];
  }),
  questById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;

    const foundQuest = await db.query.quest.findFirst({
      where: eq(quest.id, input),
      with: {
        requester: true,
        worker: true,
      },
    });
    return foundQuest;
  }),
  questCreate: publicProcedure.input(insertQuestSchema).mutation(async (opts) => {
    const { input } = opts;

    const newQuest = await db.insert(quest).values(input).returning();

    return newQuest[0]!;
  }),
  acceptQuest: publicProcedure.input(z.object({
    userId: z.string(),
    questId: z.number(),
  })).mutation(async (opts) => {
    const { input } = opts;

    const [updatedQuest] = await db.update(quest).set({ workerId: input.userId }).where(eq(quest.id, input.questId)).returning();
    return updatedQuest;
  }),
  markQuestAsCompleted: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;

    const [updatedQuest] = await db.update(quest).set({ completed: true }).where(eq(quest.id, input)).returning();
    const worker = await db.query.user.findFirst({
      where: eq(user.id, updatedQuest.workerId!),
    });
    await db
      .update(user)
      .set({ balance: worker!.balance + updatedQuest.pay, experience: worker!.experience + 150 })
      .where(eq(user.id, updatedQuest.workerId!));
    return updatedQuest;
  }),
});

export { appRouter as realAppRouter };
export type AppRouter = typeof appRouter;
