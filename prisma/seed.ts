import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const messageData: Prisma.MessageCreateInput[] = [
  {
    content: "Hello from seed",
    role: "USER",
    type: "RESULT",
  },
  {
    content: "Seeded assistant result with fragment",
    role: "ASSISTANT",
    type: "RESULT",
    fragment: {
      create: {
        sandboxUrl: "http://localhost:3000",
        title: "Seed Fragment",
        files: {},
      },
    },
  },
];

export async function main() {
  for (const message of messageData) {
    await prisma.message.create({ data: message });
  }
}

main();