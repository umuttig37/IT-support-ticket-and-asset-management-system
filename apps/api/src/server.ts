import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  assets,
  categories,
  employees,
  getDashboardMetrics,
  knowledgeBaseArticles,
  ticketComments,
  tickets
} from "./mockData.js";
import type { Ticket, TicketComment } from "./types.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/dashboard", (_request, response) => {
  response.json(getDashboardMetrics());
});

app.get("/api/tickets", (request, response) => {
  const search = String(request.query.search ?? "").trim().toLowerCase();
  const status = String(request.query.status ?? "").trim();
  const priority = String(request.query.priority ?? "").trim();

  const filtered = tickets.filter((ticket) => {
    const matchesSearch =
      search.length === 0 ||
      ticket.title.toLowerCase().includes(search) ||
      ticket.description.toLowerCase().includes(search);
    const matchesStatus = status.length === 0 || ticket.status === status;
    const matchesPriority = priority.length === 0 || ticket.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  response.json(filtered);
});

app.get("/api/tickets/:id", (request, response) => {
  const ticketId = Number(request.params.id);
  const ticket = tickets.find((entry) => entry.id === ticketId);

  if (!ticket) {
    response.status(404).json({ message: "Ticket not found" });
    return;
  }

  response.json({
    ticket,
    comments: ticketComments.filter((comment) => comment.ticketId === ticketId)
  });
});

app.post("/api/tickets", (request, response) => {
  const body = request.body as Partial<Ticket>;

  if (!body.title || !body.description || !body.priority || !body.dueAt) {
    response.status(400).json({ message: "title, description, priority and dueAt are required" });
    return;
  }

  const nextTicket: Ticket = {
    id: tickets.reduce((max, ticket) => Math.max(max, ticket.id), 1000) + 1,
    title: body.title,
    description: body.description,
    priority: body.priority,
    status: body.status ?? "open",
    categoryId: body.categoryId ?? null,
    employeeId: body.employeeId ?? null,
    assetId: body.assetId ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueAt: body.dueAt
  };

  tickets.unshift(nextTicket);
  response.status(201).json(nextTicket);
});

app.patch("/api/tickets/:id", (request, response) => {
  const ticketId = Number(request.params.id);
  const ticket = tickets.find((entry) => entry.id === ticketId);

  if (!ticket) {
    response.status(404).json({ message: "Ticket not found" });
    return;
  }

  const body = request.body as Partial<Ticket>;

  ticket.status = body.status ?? ticket.status;
  ticket.priority = body.priority ?? ticket.priority;
  ticket.categoryId = body.categoryId ?? ticket.categoryId;
  ticket.employeeId = body.employeeId ?? ticket.employeeId;
  ticket.assetId = body.assetId ?? ticket.assetId;
  ticket.dueAt = body.dueAt ?? ticket.dueAt;
  ticket.updatedAt = new Date().toISOString();

  response.json(ticket);
});

app.post("/api/tickets/:id/comments", (request, response) => {
  const ticketId = Number(request.params.id);
  const ticket = tickets.find((entry) => entry.id === ticketId);

  if (!ticket) {
    response.status(404).json({ message: "Ticket not found" });
    return;
  }

  const authorName = String(request.body.authorName ?? "").trim();
  const body = String(request.body.body ?? "").trim();

  if (!authorName || !body) {
    response.status(400).json({ message: "authorName and body are required" });
    return;
  }

  const nextComment: TicketComment = {
    id: ticketComments.reduce((max, comment) => Math.max(max, comment.id), 0) + 1,
    ticketId,
    authorName,
    body,
    createdAt: new Date().toISOString()
  };

  ticketComments.push(nextComment);
  ticket.updatedAt = new Date().toISOString();
  response.status(201).json(nextComment);
});

app.get("/api/assets", (_request, response) => {
  response.json(assets);
});

app.get("/api/employees", (_request, response) => {
  response.json(employees);
});

app.get("/api/categories", (_request, response) => {
  response.json(categories);
});

app.get("/api/knowledge-base", (_request, response) => {
  response.json(knowledgeBaseArticles);
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
