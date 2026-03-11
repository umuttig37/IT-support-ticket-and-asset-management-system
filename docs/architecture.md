# Architecture Overview

## Workspace layout

This repository is split into two apps:

- `apps/web`: React, TypeScript and Tailwind frontend
- `apps/api`: Express API plus PostgreSQL schema and seed data

## Frontend areas

- Summary header with ticket and device metrics
- Ticket queue with search
- New ticket intake form
- Ticket workspace for status changes and notes
- Employee assignment view
- Internal knowledge base

## API routes

- `GET /health`
- `GET /api/dashboard`
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `PATCH /api/tickets/:id`
- `POST /api/tickets/:id/comments`
- `GET /api/assets`
- `GET /api/employees`
- `GET /api/categories`
- `GET /api/knowledge-base`

## Current data flow

The frontend loads dashboard metrics, ticket data, assets, employees, categories and knowledge base articles on startup.
New tickets and ticket updates are sent directly to the mock API, and the UI updates its local state from those responses.

## Persistence

The SQL schema in `apps/api/db/schema.sql` is ready for PostgreSQL.
For now the API runs on seeded in-memory data from `apps/api/src/mockData.ts`, which keeps the frontend usable before a real database layer is wired in.
