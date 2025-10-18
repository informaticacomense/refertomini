-- Aggiunge la colonna updatedAt mancante alla tabella User
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
