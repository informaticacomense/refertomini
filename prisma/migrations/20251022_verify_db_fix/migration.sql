-- ============================================================
-- REFERTIMINI – Verifica Fix Database (Category + Season)
-- ============================================================

-- ✅ Controllo 1: esistenza colonna isActive in Season
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'Season' AND column_name = 'isActive';

-- ✅ Controllo 2: constraint Category aggiornata
SELECT conname AS constraint_name
FROM pg_constraint
WHERE conname = 'category_unique_per_committee';

-- ✅ Controllo 3: conferma combinazione unica
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'Category'
  AND indexname LIKE '%category_unique_per_committee%';
