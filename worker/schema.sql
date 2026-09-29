CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT '',
  event_date TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 0,
  budget TEXT NOT NULL DEFAULT '',
  venue TEXT NOT NULL DEFAULT '',
  coverage TEXT NOT NULL DEFAULT '',
  priorities TEXT NOT NULL DEFAULT '',
  referral_source TEXT NOT NULL DEFAULT '',
  contact_preference TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT NOT NULL DEFAULT '',
  notification_status TEXT NOT NULL DEFAULT 'not_recorded',
  notification_attempts INTEGER NOT NULL DEFAULT 0,
  notification_last_attempt_at TEXT NOT NULL DEFAULT '',
  notification_response_status INTEGER,
  notification_resend_id TEXT NOT NULL DEFAULT '',
  notification_error TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blocked_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

-- Run once against an existing D1 database when upgrading the inquiry form.
-- For brand new databases, the columns are already created above.
