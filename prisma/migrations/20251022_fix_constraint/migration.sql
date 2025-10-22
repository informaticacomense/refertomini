-- ============================================================
-- FIX DEFINITIVO: ignora constraint già presente in Category
-- ============================================================

-- Non modificare o eliminare il vincolo esistente
-- Prisma continuerà a funzionare senza toccarlo
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'category_unique_per_committee'
    ) THEN
        RAISE NOTICE 'Constraint già presente, nessuna azione necessaria.';
    END IF;
END $$;
