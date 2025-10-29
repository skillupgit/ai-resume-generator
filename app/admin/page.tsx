import { prisma } from "@/app/lib/db";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const users = await prisma.user.findMany({ include: { quota: true } });
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4 text-sm text-gray-600">RBAC-protected demo page.</p>
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">Email</th><th>Role</th><th>Free Downloads</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}><td>{u.email}</td><td className="text-center">{u.role}</td><td className="text-center">{u.quota?.freeDownloadsUsed ?? 0}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
