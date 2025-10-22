-- ============================================================
-- REFERTIMINI – Fix completo per Category + Season
-- ============================================================

-- ✅ 1. Rimuove il vincolo e indice duplicato su Category
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "category_unique_per_committee";
DROP INDEX IF EXISTS "category_unique_per_committee";

-- ✅ 2. Ricrea la constraint coerente con lo schema Prisma attuale
ALTER TABLE "Category"
  ADD CONSTRAINT "category_unique_per_committee"
  UNIQUE ("committeeId", "name", "seasonId");

-- ✅ 3. Aggiunge la colonna isActive su Season se non esiste già
ALTER TABLE "Season" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT false;
