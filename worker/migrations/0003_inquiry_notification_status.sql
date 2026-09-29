-- Historical inquiries predate delivery tracking; leave them explicitly untracked.
ALTER TABLE inquiries ADD COLUMN notification_status TEXT NOT NULL DEFAULT 'not_recorded';
ALTER TABLE inquiries ADD COLUMN notification_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE inquiries ADD COLUMN notification_last_attempt_at TEXT NOT NULL DEFAULT '';
ALTER TABLE inquiries ADD COLUMN notification_response_status INTEGER;
ALTER TABLE inquiries ADD COLUMN notification_resend_id TEXT NOT NULL DEFAULT '';
ALTER TABLE inquiries ADD COLUMN notification_error TEXT NOT NULL DEFAULT '';
