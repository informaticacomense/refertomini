-- ======================================================
-- FIX: aggiunge colonna mancante "isActive" a Season
-- ======================================================

ALTER TABLE "Season"
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT false;
