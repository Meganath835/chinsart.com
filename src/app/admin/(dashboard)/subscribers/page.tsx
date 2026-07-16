import { prisma } from "@/lib/db/prisma";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber
    .findMany({ orderBy: { subscribedAt: "desc" } })
    .catch(() => []);

  const active = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Subscribers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {active} active subscriber{active !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-background border border-border overflow-hidden">
        {subscribers.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Email</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden sm:table-cell">Subscribed</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-3 font-medium">{sub.email}</td>
                  <td className="px-6 py-3 text-muted-foreground hidden sm:table-cell">
                    {sub.subscribedAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sub.isActive ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                      {sub.isActive ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
