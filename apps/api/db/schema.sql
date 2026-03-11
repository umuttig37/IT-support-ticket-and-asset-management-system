CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  department VARCHAR(80) NOT NULL,
  location VARCHAR(80) NOT NULL,
  role_title VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_tag VARCHAR(40) NOT NULL UNIQUE,
  asset_type VARCHAR(50) NOT NULL,
  model VARCHAR(120) NOT NULL,
  manufacturer VARCHAR(120) NOT NULL,
  status VARCHAR(30) NOT NULL,
  serial_number VARCHAR(120) NOT NULL,
  purchase_date DATE NOT NULL,
  warranty_end_date DATE NOT NULL,
  health_status VARCHAR(30) NOT NULL,
  assigned_employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(30) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
  asset_id INTEGER REFERENCES assets(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  due_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_comments (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_name VARCHAR(120) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_base_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  summary TEXT NOT NULL,
  category VARCHAR(80) NOT NULL,
  recommended_fix TEXT NOT NULL,
  symptoms TEXT NOT NULL
);
