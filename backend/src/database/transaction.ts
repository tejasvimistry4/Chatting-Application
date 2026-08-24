import prisma from "./prisma";

export const transaction = prisma.$transaction;
