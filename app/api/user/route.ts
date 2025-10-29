import { prisma } from "@/app/lib/db";
export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, email, phone } = body;
  if (!email) return new Response("email required", { status: 400 });
  const user = await prisma.user.upsert({
    where: { email },
    update: { fullName, phone },
    create: { email, fullName: fullName||"User", phone, role: "USER", quota: { create: {} } }
  });
  return Response.json({ ok: true, userId: user.id });
}
