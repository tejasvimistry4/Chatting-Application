import { z } from "zod";

const uuid = z.string().uuid();

export const sendMessageSchema = z.object({
  body: z.object({
    chatId: uuid,
    content: z.string().trim().max(5000).optional(),
    type: z.enum(["TEXT", "IMAGE", "FILE"]).default("TEXT"),
    fileUrl: z.string().url().optional(),
    fileName: z.string().max(255).optional(),
    fileSize: z.number().int().positive().optional(),
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    chatId: uuid,
  }),

  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(30),
    cursor: z.string().datetime().optional(),
  }),
});
