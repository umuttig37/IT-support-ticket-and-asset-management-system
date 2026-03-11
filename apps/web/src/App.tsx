import { ReactNode, useEffect, useState } from "react";
import { api } from "./api";
import type { Asset, DashboardMetrics, Employee, KnowledgeBaseArticle } from "./types";

const metricCards: Array<{ key: keyof DashboardMetrics; label: string; note: string }> = [
  { key: "openTickets", label: "Open tickets", note: "still waiting for resolution" },
  { key: "overdueTickets", label: "Overdue", note: "need attention first" },
  { key: "devicesInStock", label: "In stock", note: "available for swaps or onboarding" },
  { key: "devicesAssigned", label: "Assigned", note: "currently in employee use" }
];

export function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardData, assetData, employeeData, knowledgeBaseData] = await Promise.all([
          api.getDashboard(),
          api.getAssets(),
          api.getEmployees(),
          api.getKnowledgeBase()
        ]);

        setMetrics(dashboardData);
        setAssets(assetData);
        setEmployees(employeeData);
        setArticles(knowledgeBaseData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  if (loading) {
    return <div className="p-10 text-slate">Loading ticket data...</div>;
  }

  if (error || !metrics) {
    return <div className="p-10 text-rose-700">Unable to load the support dashboard: {error ?? "Metrics missing"}</div>;
  }

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(180,83,9,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,118,110,0.18),_transparent_30%),linear-gradient(180deg,#fffdf8,#f5f7fb)]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Internal IT Operations</p>
              <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-stone-900 md:text-6xl">
                Keep support tickets, device ownership and internal fixes in one place.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">
                A simple working view for the IT desk: open cases, assigned hardware and common fixes without jumping between
                spreadsheets, chat messages and separate docs.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur">
                <p className="text-sm font-semibold text-slate">Shift note</p>
                <p className="mt-3 text-2xl font-semibold text-stone-900">Start with overdue tickets, then clear the spare device queue.</p>
              </div>
              <div className="rounded-[2rem] border border-stone-200 bg-stone-950 p-6 text-stone-50 shadow-panel">
                <p className="text-sm uppercase tracking-[0.2em] text-stone-300">On duty</p>
                <p className="mt-2 text-2xl font-semibold">Laura Miettinen</p>
                <p className="mt-2 text-sm text-stone-300">Coordinating escalations, device swaps and user follow-up.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <article key={card.key} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-panel">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold text-stone-900">{metrics[card.key]}</p>
              <p className="mt-2 text-sm text-slate">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-12 lg:grid-cols-2">
        <Panel title="Employee assignments" subtitle="Current device assignments by employee.">
          <div className="space-y-3">
            {employees.map((employee) => {
              const assignedAssets = assets.filter((asset) => asset.assignedEmployeeId === employee.id);
              return (
                <article key={employee.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-stone-900">{employee.fullName}</h3>
                      <p className="mt-1 text-sm text-slate">{employee.roleTitle}</p>
                      <p className="text-sm text-slate">{employee.department} - {employee.location}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate">
                      {assignedAssets.length} device{assignedAssets.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate">
                    {assignedAssets.length > 0
                      ? assignedAssets.map((asset) => `${asset.assetTag} (${asset.assetType})`).join(", ")
                      : "No devices assigned right now."}
                  </p>
                </article>
              );
            })}
          </div>
        </Panel>

        <Panel title="Knowledge base" subtitle="Short internal fixes for recurring issues.">
          <div className="space-y-3">
            {articles.map((article) => (
              <article key={article.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-stone-900">{article.title}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate">{article.category}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate">{article.summary}</p>
                <p className="mt-3 text-sm text-stone-900">
                  <span className="font-semibold">Symptoms:</span> {article.symptoms}
                </p>
                <p className="mt-2 text-sm text-stone-900">
                  <span className="font-semibold">Suggested fix:</span> {article.recommendedFix}
                </p>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Panel(props: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-panel">
      <div className="mb-5">
        <h2 className="font-serif text-3xl text-stone-900">{props.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">{props.subtitle}</p>
      </div>
      {props.children}
    </section>
  );
}
