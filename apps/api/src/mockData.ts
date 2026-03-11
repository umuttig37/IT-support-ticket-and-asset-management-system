import type {
  Asset,
  Category,
  DashboardMetrics,
  Employee,
  KnowledgeBaseArticle,
  TicketComment,
  Ticket
} from "./types.js";

export const employees: Employee[] = [
  { id: 1, fullName: "Atte Hämäläinen", email: "atte.hamalainen@company.local", department: "Finance", location: "Helsinki", roleTitle: "Financial Controller" },
  { id: 2, fullName: "Mikko Korhonen", email: "mikko.korhonen@company.local", department: "Product", location: "Espoo", roleTitle: "Product Designer" },
  { id: 3, fullName: "Sara Salo", email: "sara.salo@company.local", department: "Operations", location: "Tampere", roleTitle: "Operations Specialist" },
  { id: 4, fullName: "Laura Miettinen", email: "laura.miettinen@company.local", department: "IT Services", location: "Helsinki", roleTitle: "IT Support Specialist" }
];

export const categories: Category[] = [
  { id: 1, name: "Hardware", description: "Laptop, monitor and peripheral issues" },
  { id: 2, name: "Accounts", description: "Sign-in, MFA and access issues" },
  { id: 3, name: "Messaging", description: "Email and Outlook related issues" }
];

export const assets: Asset[] = [
  {
    id: 1,
    assetTag: "LT-2024-014",
    assetType: "Laptop",
    model: "Latitude 7450",
    manufacturer: "Dell",
    status: "assigned",
    serialNumber: "DL7450-1A4K",
    purchaseDate: "2024-02-15",
    warrantyEndDate: "2027-02-15",
    healthStatus: "healthy",
    assignedEmployeeId: 1,
    notes: "Dock compatible"
  },
  {
    id: 2,
    assetTag: "MN-2023-088",
    assetType: "Monitor",
    model: "P2723DE",
    manufacturer: "Dell",
    status: "in_stock",
    serialNumber: "MN-88-2390",
    purchaseDate: "2023-08-01",
    warrantyEndDate: "2026-08-01",
    healthStatus: "healthy",
    assignedEmployeeId: null,
    notes: "Reserved for onboarding"
  },
  {
    id: 3,
    assetTag: "PH-2024-011",
    assetType: "Phone",
    model: "iPhone 15",
    manufacturer: "Apple",
    status: "assigned",
    serialNumber: "APL-15-99X",
    purchaseDate: "2024-10-05",
    warrantyEndDate: "2026-10-05",
    healthStatus: "attention",
    assignedEmployeeId: 3,
    notes: "Battery health below target"
  }
];

export const tickets: Ticket[] = [
  {
    id: 1001,
    title: "Outlook stops syncing after VPN reconnect",
    description: "Mailbox stays disconnected for 10-15 minutes after resuming from sleep.",
    priority: "medium",
    status: "open",
    categoryId: 3,
    employeeId: 1,
    assetId: 1,
    createdAt: "2026-03-09T08:15:00.000Z",
    updatedAt: "2026-03-10T09:05:00.000Z",
    dueAt: "2026-03-12T14:00:00.000Z"
  },
  {
    id: 1002,
    title: "Windows login loop on meeting room PC",
    description: "Device returns to the sign-in screen after entering credentials.",
    priority: "high",
    status: "in_progress",
    categoryId: 2,
    employeeId: 2,
    assetId: null,
    createdAt: "2026-03-07T10:00:00.000Z",
    updatedAt: "2026-03-10T14:30:00.000Z",
    dueAt: "2026-03-08T12:00:00.000Z"
  },
  {
    id: 1003,
    title: "Mobile phone battery drains before noon",
    description: "Work profile sync appears to use battery aggressively after the last update.",
    priority: "low",
    status: "resolved",
    categoryId: 1,
    employeeId: 3,
    assetId: 3,
    createdAt: "2026-03-01T09:20:00.000Z",
    updatedAt: "2026-03-04T15:00:00.000Z",
    dueAt: "2026-03-03T16:00:00.000Z"
  }
];

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
  {
    id: 1,
    title: "Printer not working",
    summary: "Use this flow when the printer is offline, out of queue or not visible to the user.",
    category: "Hardware",
    recommendedFix: "Restart print spooler, verify network reachability and reinstall the printer profile.",
    symptoms: "Printer offline, queue stuck, job disappears without printing"
  },
  {
    id: 2,
    title: "Windows login issues",
    summary: "Troubleshooting steps for stale credentials, account lockouts and profile load failures.",
    category: "Accounts",
    recommendedFix: "Validate account status, clear cached credentials and test sign-in without the roaming profile.",
    symptoms: "Invalid password error, login loop, temporary profile"
  },
  {
    id: 3,
    title: "Outlook sync issue",
    summary: "Mailbox synchronization failures in hybrid networks and after sleep/resume cycles.",
    category: "Messaging",
    recommendedFix: "Rebuild the OST file, verify VPN stability and reauthenticate Microsoft 365.",
    symptoms: "Disconnected state, folders not updating, send/receive errors"
  }
];

export const ticketComments: TicketComment[] = [
  {
    id: 1,
    ticketId: 1001,
    authorName: "Laura Miettinen",
    body: "Reproduced the issue once after sleep and VPN reconnect. Next step is an OST rebuild if it happens again.",
    createdAt: "2026-03-11T08:10:00.000Z"
  },
  {
    id: 2,
    ticketId: 1002,
    authorName: "Mikko Korhonen",
    body: "Issue is limited to the meeting room PC. Other shared workstations still accept sign-in normally.",
    createdAt: "2026-03-10T13:20:00.000Z"
  }
];

export function getDashboardMetrics(): DashboardMetrics {
  return {
    openTickets: tickets.filter((ticket) => ticket.status !== "resolved").length,
    overdueTickets: tickets.filter((ticket) => ticket.status !== "resolved" && new Date(ticket.dueAt) < new Date()).length,
    devicesInStock: assets.filter((asset) => asset.status === "in_stock").length,
    devicesAssigned: assets.filter((asset) => asset.assignedEmployeeId !== null).length
  };
}
