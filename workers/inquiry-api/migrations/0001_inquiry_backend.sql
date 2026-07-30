PRAGMA foreign_keys = ON;

CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT NOT NULL UNIQUE,
  submission_token TEXT NOT NULL UNIQUE,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  buyer_full_name TEXT NOT NULL,
  buyer_company_name TEXT NOT NULL,
  buyer_country TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  preferred_contact TEXT NOT NULL,
  general_requirements TEXT,
  consent_at TEXT NOT NULL,
  attachment_key TEXT,
  attachment_name TEXT,
  attachment_type TEXT,
  attachment_size INTEGER,
  client_fingerprint TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_inquiries_submitted_at ON inquiries(submitted_at);
CREATE INDEX idx_inquiries_buyer_email ON inquiries(buyer_email);
CREATE INDEX idx_inquiries_delivery_status ON inquiries(delivery_status);

CREATE TABLE inquiry_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inquiry_reference TEXT NOT NULL,
  line_index INTEGER NOT NULL,
  item_key TEXT NOT NULL,
  product_id TEXT,
  product_code TEXT,
  variant_id TEXT,
  variant_label TEXT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 9999),
  note TEXT,
  manual INTEGER NOT NULL DEFAULT 0 CHECK (manual IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (inquiry_reference) REFERENCES inquiries(reference) ON DELETE CASCADE,
  UNIQUE (inquiry_reference, line_index)
);

CREATE INDEX idx_inquiry_items_reference ON inquiry_items(inquiry_reference);
CREATE INDEX idx_inquiry_items_code ON inquiry_items(code);

CREATE TABLE inquiry_delivery_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inquiry_reference TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'inquiry.received',
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT,
  delivered_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (inquiry_reference) REFERENCES inquiries(reference) ON DELETE CASCADE
);

CREATE INDEX idx_inquiry_outbox_status ON inquiry_delivery_outbox(status, next_attempt_at);
CREATE INDEX idx_inquiry_outbox_reference ON inquiry_delivery_outbox(inquiry_reference);

CREATE TABLE inquiry_rate_limits (
  fingerprint TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (fingerprint, window_start)
);

CREATE INDEX idx_inquiry_rate_limit_window ON inquiry_rate_limits(window_start);
