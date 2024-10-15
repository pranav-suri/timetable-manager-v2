import "source-map-support/register";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("Hello World");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    console.log("Error: Disconnecting Prisma Client");
    await prisma.$disconnect();
    process.exit(1);
  });
