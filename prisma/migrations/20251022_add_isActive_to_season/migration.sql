-- Add column isActive to Season (default false)
ALTER TABLE "Season"
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT false;
