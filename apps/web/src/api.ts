import type {
  Asset,
  Category,
  DashboardMetrics,
  Employee,
  KnowledgeBaseArticle,
  TicketComment,
  TicketDetailResponse,
  Ticket
} from "./types";

const apiBaseUrl = "http://localhost:4000/api";

async function readJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getDashboard: () => readJson<DashboardMetrics>("/dashboard"),
  getTickets: (search = "") =>
    readJson<Ticket[]>(`/tickets${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getTicket: (ticketId: number) => readJson<TicketDetailResponse>(`/tickets/${ticketId}`),
  createTicket: (payload: Partial<Ticket>) =>
    readJson<Ticket>("/tickets", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateTicket: (ticketId: number, payload: Partial<Ticket>) =>
    readJson<Ticket>(`/tickets/${ticketId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  addTicketComment: (ticketId: number, payload: Pick<TicketComment, "authorName" | "body">) =>
    readJson<TicketComment>(`/tickets/${ticketId}/comments`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getAssets: () => readJson<Asset[]>("/assets"),
  getEmployees: () => readJson<Employee[]>("/employees"),
  getCategories: () => readJson<Category[]>("/categories"),
  getKnowledgeBase: () => readJson<KnowledgeBaseArticle[]>("/knowledge-base")
};
