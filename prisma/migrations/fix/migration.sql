-- ======================================================
-- FIX DEFINITIVO PER RENDER / PRISMA
-- Elimina in sicurezza il vincolo e l'indice duplicato
-- ======================================================

DO $$
BEGIN
    -- Se esiste un vincolo con questo nome, lo eliminiamo
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'category_unique_per_committee'
    ) THEN
        ALTER TABLE "Category" DROP CONSTRAINT category_unique_per_committee;
        RAISE NOTICE 'Constraint category_unique_per_committee eliminato.';
    END IF;

    -- Se esiste ancora un indice con lo stesso nome, lo eliminiamo
    IF EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'category_unique_per_committee'
    ) THEN
        DROP INDEX category_unique_per_committee;
        RAISE NOTICE 'Indice category_unique_per_committee eliminato.';
    END IF;
END $$;

-- Ora Prisma potrà creare lo schema normalmente senza errori.
