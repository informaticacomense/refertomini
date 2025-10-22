-- Rimuove il vincolo vecchio se esiste
ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS category_unique_per_committee;

-- Aggiunge il nuovo vincolo unico corretto
ALTER TABLE "Category"
ADD CONSTRAINT category_unique_per_committee UNIQUE ("committeeId", "name", "seasonId");
