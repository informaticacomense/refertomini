-- ============================================================
-- Fix definitivo REFERTIMINI: Category unique constraint
-- ============================================================

-- ✅ Elimina la vecchia constraint se esiste
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "category_unique_per_committee";

-- ✅ Elimina l'indice vecchio se resta ancora
DROP INDEX IF EXISTS "category_unique_per_committee";

-- ✅ Ricrea la constraint coerente con lo schema Prisma attuale
ALTER TABLE "Category"
  ADD CONSTRAINT "category_unique_per_committee"
  UNIQUE ("committeeId", "name", "seasonId");
