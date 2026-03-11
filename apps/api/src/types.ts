export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus = "open" | "in_progress" | "resolved";

export interface DashboardMetrics {
  openTickets: number;
  overdueTickets: number;
  devicesInStock: number;
  devicesAssigned: number;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  department: string;
  location: string;
  roleTitle: string;
}

export interface Asset {
  id: number;
  assetTag: string;
  assetType: string;
  model: string;
  manufacturer: string;
  status: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyEndDate: string;
  healthStatus: string;
  assignedEmployeeId: number | null;
  notes: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  categoryId: number | null;
  employeeId: number | null;
  assetId: number | null;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
}

export interface TicketComment {
  id: number;
  ticketId: number;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  recommendedFix: string;
  symptoms: string;
}
