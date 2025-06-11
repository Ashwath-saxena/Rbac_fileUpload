import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getOrCreateUser() {
  try {
    const authResult = await auth();
    const clerkId = authResult.userId;
    const user = await currentUser();

    if (!clerkId || !user) {
      throw new Error("Unauthorized");
    }

    // Get or create the user
    const dbUser = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email: user.emailAddresses[0]?.emailAddress || "placeholder@example.com",
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Anonymous User',
        updatedAt: new Date(), // Ensure the updatedAt is refreshed
      },
      create: {
        clerkId,
        email: user.emailAddresses[0]?.emailAddress || "placeholder@example.com",
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Anonymous User',
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
}

// Helper function to format date in UTC
export function formatUTCTime(date: Date = new Date()): string {
  return date.toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '');
}