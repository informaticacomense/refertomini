-- ======================================================
-- FIX DEFINITIVO: eliminazione sicura del vincolo/index
-- ======================================================

DO $do$
BEGIN
    -- Se esiste un vincolo con questo nome, lo eliminiamo
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'category_unique_per_committee'
    ) THEN
        EXECUTE 'ALTER TABLE "Category" DROP CONSTRAINT category_unique_per_committee';
        RAISE NOTICE '✅ Constraint category_unique_per_committee eliminato';
    ELSE
        RAISE NOTICE 'ℹ️ Constraint non trovato, nessuna azione necessaria';
    END IF;

    -- Se esiste ancora un indice con lo stesso nome, lo eliminiamo
    IF EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'category_unique_per_committee'
    ) THEN
        EXECUTE 'DROP INDEX IF EXISTS "category_unique_per_committee"';
        RAISE NOTICE '✅ Indice category_unique_per_committee eliminato';
    ELSE
        RAISE NOTICE 'ℹ️ Indice non trovato, nessuna azione necessaria';
    END IF;
END $do$;
