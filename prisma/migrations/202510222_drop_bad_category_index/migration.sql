-- 💥 Fix per errore Prisma: cannot drop index category_unique_per_committee
-- Rimuove il vincolo unico bloccante e ricrea il corretto
DO $$
BEGIN
    -- Se il vincolo esiste, lo eliminiamo
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'category_unique_per_committee'
    ) THEN
        ALTER TABLE "Category" DROP CONSTRAINT category_unique_per_committee;
    END IF;
END $$;

-- ✅ Ricrea il vincolo unico corretto
ALTER TABLE "Category"
ADD CONSTRAINT category_unique_per_committee UNIQUE ("committeeId", "name", "seasonId");
