import { prisma } from "@/app/lib/db";
export async function PUT(req: Request) {
  const { userId, resume } = await req.json();
  if (!userId || !resume) return new Response("Bad Request", { status:400 });
  const saved = await prisma.resume.upsert({
    where: { id: resume.id || "new" },
    update: { jsonContent: resume, role: resume.role || "QA Analyst", watermark: true },
    create: { userId, role: resume.role || "QA Analyst", jsonContent: resume, watermark: true }
  });
  return Response.json({ ok:true, id: saved.id });
}
