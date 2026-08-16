import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@chinsart.com";
  const newPassword = process.env.ADMIN_PASSWORD ?? "changeme123";

  const hashed = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.updateMany({
    where: { email, role: "ADMIN" },
    data: { password: hashed },
  });

  if (user.count === 0) {
    console.log(`No admin found with email: ${email}`);
    console.log("Check your ADMIN_EMAIL value in .env");
  } else {
    console.log(`✓ Password reset for: ${email}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
