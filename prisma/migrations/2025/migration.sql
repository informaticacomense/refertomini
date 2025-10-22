-- ============================================================
-- REFERTIMINI – Migrazione manuale per Season.isActive
-- ============================================================

ALTER TABLE "Season" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT false;
