import { FormEvent, ReactNode, useEffect, useState } from "react";
import { api } from "./api";
import type { Asset, Category, DashboardMetrics, Employee, KnowledgeBaseArticle, Ticket, TicketPriority, TicketStatus } from "./types";

const metricCards: Array<{ key: keyof DashboardMetrics; label: string; note: string }> = [
  { key: "openTickets", label: "Open tickets", note: "still waiting for resolution" },
  { key: "overdueTickets", label: "Overdue", note: "need attention first" },
  { key: "devicesInStock", label: "In stock", note: "available for swaps or onboarding" },
  { key: "devicesAssigned", label: "Assigned", note: "currently in employee use" }
];

export function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketSearch, setTicketSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardData, ticketData, assetData, employeeData, categoryData, knowledgeBaseData] = await Promise.all([
          api.getDashboard(),
          api.getTickets(),
          api.getAssets(),
          api.getEmployees(),
          api.getCategories(),
          api.getKnowledgeBase()
        ]);

        setMetrics(dashboardData);
        setTickets(ticketData);
        setAssets(assetData);
        setEmployees(employeeData);
        setCategories(categoryData);
        setArticles(knowledgeBaseData);
        setSelectedTicket(ticketData[0] ?? null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  async function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dueAtValue = String(formData.get("dueAt") ?? "");

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      priority: String(formData.get("priority") ?? "medium") as TicketPriority,
      status: "open" as const,
      categoryId: Number(formData.get("categoryId") ?? 0) || null,
      employeeId: Number(formData.get("employeeId") ?? 0) || null,
      assetId: Number(formData.get("assetId") ?? 0) || null,
      dueAt: new Date(dueAtValue).toISOString()
    };

    const createdTicket = await api.createTicket(payload);
    const nextTickets = [createdTicket, ...tickets];
    setTickets(nextTickets);
    setSelectedTicket(createdTicket);
    setMetrics((current) =>
      current
        ? {
            ...current,
            openTickets: current.openTickets + 1
          }
        : current
    );
    event.currentTarget.reset();
  }

  async function handleTicketSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ticketData = await api.getTickets(ticketSearch);
    setTickets(ticketData);
    setSelectedTicket(ticketData[0] ?? null);
  }

  if (loading) {
    return <div className="p-10 text-slate">Loading ticket data...</div>;
  }

  if (error || !metrics) {
    return <div className="p-10 text-rose-700">Unable to load the support dashboard: {error ?? "Metrics missing"}</div>;
  }

  const assignedAssetsForSelectedEmployee = selectedTicket?.employeeId
    ? assets.filter((asset) => asset.assignedEmployeeId === selectedTicket.employeeId)
    : [];

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

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-12 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="space-y-8">
          <Panel title="Active queue" subtitle="Open a ticket, review the latest note and update the next action.">
            <form className="mb-5 flex gap-3" onSubmit={(event) => void handleTicketSearch(event)}>
              <input
                className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-signal focus:bg-white"
                placeholder="Search by title, user symptom or keyword"
                value={ticketSearch}
                onChange={(event) => setTicketSearch(event.target.value)}
              />
              <button className="rounded-2xl bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-signal" type="submit">
                Search
              </button>
            </form>

            <div className="space-y-3">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                    selectedTicket?.id === ticket.id
                      ? "border-amber-300 bg-amber-50/80 shadow-sm"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                  }`}
                  type="button"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate">#{ticket.id}</span>
                    <Badge className={priorityStyles[ticket.priority]}>{humanizePriority(ticket.priority)}</Badge>
                    <Badge className={statusStyles[ticket.status]}>{humanizeStatus(ticket.status)}</Badge>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-stone-900">{ticket.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate">{ticket.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate">
                    <span>Due {new Date(ticket.dueAt).toLocaleDateString()}</span>
                    <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="New support request" subtitle="Capture the issue before it disappears into email or chat.">
            <form className="space-y-4" onSubmit={(event) => void handleCreateTicket(event)}>
              <Input name="title" label="Short summary" placeholder="Laptop drops Wi-Fi after docking" />
              <TextArea
                name="description"
                label="What the user is seeing"
                placeholder="Include symptoms, recent changes and anything already tried."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Select name="priority" label="Priority" defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
                <Input name="dueAt" label="Target due time" type="datetime-local" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Select name="categoryId" label="Issue category" defaultValue="">
                  <option value="">Select if needed</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <Select name="employeeId" label="Reported by" defaultValue="4">
                  <option value="">Unassigned</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </option>
                  ))}
                </Select>
              </div>
              <Select name="assetId" label="Affected device" defaultValue="">
                <option value="">No device linked</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.assetTag} - {asset.manufacturer} {asset.model}
                  </option>
                ))}
              </Select>
              <button className="w-full rounded-2xl bg-stone-900 px-4 py-3 font-semibold text-white transition hover:bg-signal" type="submit">
                Create ticket
              </button>
            </form>
          </Panel>
        </div>

        <div className="space-y-8">
          <Panel title="Ticket overview" subtitle="Current owner, affected device and the basic case context.">
            {selectedTicket ? (
              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(135deg,#fff8ed,#ffffff)] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-sm font-semibold text-slate">Ticket #{selectedTicket.id}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-stone-900">{selectedTicket.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate">{selectedTicket.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={priorityStyles[selectedTicket.priority]}>{humanizePriority(selectedTicket.priority)}</Badge>
                      <Badge className={statusStyles[selectedTicket.status]}>{humanizeStatus(selectedTicket.status)}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <InfoCard label="Requester" value={findEmployeeName(employees, selectedTicket.employeeId)} />
                  <InfoCard label="Affected asset" value={findAssetName(assets, selectedTicket.assetId)} />
                  <InfoCard label="Due date" value={new Date(selectedTicket.dueAt).toLocaleString()} />
                </div>

                <PanelInset title="Related user" subtitle="Employee details and any devices already assigned to them.">
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-stone-50 p-4">
                      <p className="text-base font-semibold text-stone-900">{findEmployeeName(employees, selectedTicket.employeeId)}</p>
                      <p className="mt-1 text-sm text-slate">{findEmployeeMeta(employees, selectedTicket.employeeId)}</p>
                    </div>
                    <div className="space-y-2">
                      {assignedAssetsForSelectedEmployee.length > 0 ? (
                        assignedAssetsForSelectedEmployee.map((asset) => (
                          <div key={asset.id} className="rounded-2xl border border-stone-200 p-3">
                            <p className="font-medium text-stone-900">{asset.assetTag} - {asset.assetType}</p>
                            <p className="mt-1 text-sm text-slate">{asset.manufacturer} {asset.model} - {asset.healthStatus}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate">No assigned devices for this employee.</p>
                      )}
                    </div>
                  </div>
                </PanelInset>
              </div>
            ) : (
              <p className="text-sm text-slate">Select a ticket to see details.</p>
            )}
          </Panel>

          <div className="grid gap-8 lg:grid-cols-2">
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
          </div>
        </div>
      </section>
    </main>
  );
}

const priorityStyles: Record<TicketPriority, string> = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800"
};

const statusStyles: Record<TicketStatus, string> = {
  open: "bg-sky-100 text-sky-800",
  in_progress: "bg-amber-100 text-amber-800",
  resolved: "bg-emerald-100 text-emerald-800"
};

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

function PanelInset(props: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-stone-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-stone-900">{props.title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate">{props.subtitle}</p>
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function Badge(props: { children: ReactNode; className: string }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${props.className}`}>{props.children}</span>;
}

function Input(props: { label: string; name: string; placeholder?: string; type?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate">{props.label}</span>
      <input
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-signal"
        name={props.name}
        placeholder={props.placeholder}
        type={props.type ?? "text"}
        defaultValue={props.defaultValue}
        required
      />
    </label>
  );
}

function TextArea(props: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate">{props.label}</span>
      <textarea
        className="min-h-28 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-signal"
        name={props.name}
        placeholder={props.placeholder}
        required
      />
    </label>
  );
}

function Select(props: { label: string; name: string; children: ReactNode; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate">{props.label}</span>
      <select
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-signal"
        name={props.name}
        defaultValue={props.defaultValue}
      >
        {props.children}
      </select>
    </label>
  );
}

function InfoCard(props: { label: string; value: string }) {
  return (
    <article className="rounded-[1.5rem] border border-stone-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">{props.label}</p>
      <p className="mt-2 text-base font-semibold text-stone-900">{props.value}</p>
    </article>
  );
}

function humanizePriority(priority: TicketPriority) {
  return priority === "high" ? "High priority" : priority === "medium" ? "Medium priority" : "Low priority";
}

function humanizeStatus(status: TicketStatus) {
  return status === "in_progress" ? "In progress" : status.charAt(0).toUpperCase() + status.slice(1);
}

function findEmployeeName(employees: Employee[], employeeId: number | null) {
  return employees.find((employee) => employee.id === employeeId)?.fullName ?? "Not assigned";
}

function findEmployeeMeta(employees: Employee[], employeeId: number | null) {
  const employee = employees.find((entry) => entry.id === employeeId);
  return employee ? `${employee.roleTitle} - ${employee.department} - ${employee.location}` : "No requester linked yet.";
}

function findAssetName(assets: Asset[], assetId: number | null) {
  const asset = assets.find((entry) => entry.id === assetId);
  return asset ? `${asset.assetTag} - ${asset.manufacturer} ${asset.model}` : "No asset linked";
}
