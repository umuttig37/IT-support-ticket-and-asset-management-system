INSERT INTO employees (full_name, email, department, location, role_title) VALUES
  ('Atte Hämäläinen', 'atte.hamalainen@company.local', 'Finance', 'Helsinki', 'Financial Controller'),
  ('Mikko Korhonen', 'mikko.korhonen@company.local', 'Product', 'Espoo', 'Product Designer'),
  ('Sara Salo', 'sara.salo@company.local', 'Operations', 'Tampere', 'Operations Specialist'),
  ('Laura Miettinen', 'laura.miettinen@company.local', 'IT Services', 'Helsinki', 'IT Support Specialist');

INSERT INTO categories (name, description) VALUES
  ('Hardware', 'Laptop, monitor and peripheral issues'),
  ('Accounts', 'Sign-in, MFA and access issues'),
  ('Messaging', 'Email and Outlook related issues');

INSERT INTO assets (
  asset_tag,
  asset_type,
  model,
  manufacturer,
  status,
  serial_number,
  purchase_date,
  warranty_end_date,
  health_status,
  assigned_employee_id,
  notes
) VALUES
  ('LT-2024-014', 'Laptop', 'Latitude 7450', 'Dell', 'assigned', 'DL7450-1A4K', '2024-02-15', '2027-02-15', 'healthy', 1, 'Dock compatible'),
  ('MN-2023-088', 'Monitor', 'P2723DE', 'Dell', 'in_stock', 'MN-88-2390', '2023-08-01', '2026-08-01', 'healthy', NULL, 'Reserved for onboarding'),
  ('PH-2024-011', 'Phone', 'iPhone 15', 'Apple', 'assigned', 'APL-15-99X', '2024-10-05', '2026-10-05', 'attention', 3, 'Battery health below target');

INSERT INTO tickets (
  title,
  description,
  priority,
  status,
  category_id,
  employee_id,
  asset_id,
  created_at,
  updated_at,
  due_at
) VALUES
  ('Outlook stops syncing after VPN reconnect', 'Mailbox stays disconnected for 10-15 minutes after resuming from sleep.', 'medium', 'open', 3, 1, 1, '2026-03-09T08:15:00Z', '2026-03-10T09:05:00Z', '2026-03-12T14:00:00Z'),
  ('Windows login loop on meeting room PC', 'Device returns to the sign-in screen after entering credentials.', 'high', 'in_progress', 2, 2, NULL, '2026-03-07T10:00:00Z', '2026-03-10T14:30:00Z', '2026-03-08T12:00:00Z'),
  ('Mobile phone battery drains before noon', 'Work profile sync appears to use battery aggressively after the last update.', 'low', 'resolved', 1, 3, 3, '2026-03-01T09:20:00Z', '2026-03-04T15:00:00Z', '2026-03-03T16:00:00Z');

INSERT INTO knowledge_base_articles (title, summary, category, recommended_fix, symptoms) VALUES
  ('Printer not working', 'Use this flow when the printer is offline, out of queue or not visible to the user.', 'Hardware', 'Restart print spooler, verify network reachability and reinstall the printer profile.', 'Printer offline, queue stuck, job disappears without printing'),
  ('Windows login issues', 'Troubleshooting steps for stale credentials, account lockouts and profile load failures.', 'Accounts', 'Validate account status, clear cached credentials and test sign-in without the roaming profile.', 'Invalid password error, login loop, temporary profile'),
  ('Outlook sync issue', 'Mailbox synchronization failures in hybrid networks and after sleep/resume cycles.', 'Messaging', 'Rebuild the OST file, verify VPN stability and reauthenticate Microsoft 365.', 'Disconnected state, folders not updating, send/receive errors');

INSERT INTO ticket_comments (ticket_id, author_name, body, created_at) VALUES
  (1001, 'Laura Miettinen', 'Reproduced the issue once after sleep and VPN reconnect. Next step is an OST rebuild if it happens again.', '2026-03-11T08:10:00Z'),
  (1002, 'Mikko Korhonen', 'Issue is limited to the meeting room PC. Other shared workstations still accept sign-in normally.', '2026-03-10T13:20:00Z');
