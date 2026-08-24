import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID format");

const paginationQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .min(1, "Page must be greater than 0")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(20),
});

export const createPrivateChatSchema = z.object({
  body: z
    .object({
      userId: uuidSchema,
    })
    .strict(),
});

export const createGroupSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(3, "Group name must be at least 3 characters")
        .max(50, "Group name cannot exceed 50 characters"),

      members: z
        .array(uuidSchema)
        .min(2, "At least two members are required")
        .refine(
          (members) => new Set(members).size === members.length,
          "Duplicate members are not allowed",
        ),
    })
    .strict(),
});

export const renameGroupSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(3, "Group name must be at least 3 characters")
        .max(50, "Group name cannot exceed 50 characters"),
    })
    .strict(),
});

export const addMembersSchema = z.object({
  body: z
    .object({
      members: z
        .array(uuidSchema)
        .min(1, "Select at least one member")
        .refine(
          (members) => new Set(members).size === members.length,
          "Duplicate members are not allowed",
        ),
    })
    .strict(),
});

export const chatIdParamSchema = z.object({
  params: z
    .object({
      chatId: uuidSchema,
    })
    .strict(),
});

export const removeMemberParamSchema = z.object({
  params: z
    .object({
      chatId: uuidSchema,
      memberId: uuidSchema,
    })
    .strict(),
});

export const getChatsQuerySchema = z.object({
  query: paginationQuerySchema.extend({
    search: z
      .string()
      .trim()
      .max(50, "Search cannot exceed 50 characters")
      .optional(),
  }),
});

export const getChatByIdQuerySchema = z.object({
  query: paginationQuerySchema.extend({
    limit: z.coerce.number().int().min(1).max(100).default(30),
  }),
});
