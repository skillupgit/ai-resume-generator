import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@skillup.study" },
    update: {},
    create: {
      email: "admin@skillup.study",
      fullName: "Admin User",
      role: Role.ADMIN,
      phone: "000-000-0000",
      quota: { create: {} }
    }
  });
  const user = await prisma.user.upsert({
    where: { email: "demo@skillup.study" },
    update: {},
    create: {
      email: "demo@skillup.study",
      fullName: "Demo User",
      role: Role.USER,
      phone: "111-111-1111",
      quota: { create: {} }
    }
  });
  console.log({ admin, user });
}
main().finally(() => prisma.$disconnect());
