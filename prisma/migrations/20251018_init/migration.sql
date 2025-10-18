-- ======================================================
-- REFERTIMINI – powered by Informatica Comense
-- Prima migrazione iniziale Prisma (2025-10-18)
-- Database: referti_minibasket (PostgreSQL)
-- ======================================================

-- Creazione enum per lo stato gara
CREATE TYPE "GameStatus" AS ENUM ('IN_PROGRAMMA', 'CARICATA', 'OMOLOGATA');

-- ======================================================
-- TABELLA SEASON
-- ======================================================
CREATE TABLE "Season" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- TABELLA COMMITTEE
-- ======================================================
CREATE TABLE "Committee" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "logoUrl" TEXT,
  "seasonId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "committee_unique_per_season" UNIQUE ("seasonId", "name"),
  FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE
);

-- ======================================================
-- TABELLA CATEGORY
-- ======================================================
CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "committeeId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "category_unique_per_committee" UNIQUE ("committeeId", "name"),
  FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE CASCADE
);

-- ======================================================
-- TABELLA COMPANY (Società)
-- ======================================================
CREATE TABLE "Company" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "committeeId" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "company_unique_per_committee" UNIQUE ("committeeId", "name"),
  FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE CASCADE
);

-- ======================================================
-- TABELLA USER
-- ======================================================
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "teamName" TEXT NOT NULL,
  "isAdmin" BOOLEAN DEFAULT FALSE,
  "isSuperAdmin" BOOLEAN DEFAULT FALSE,
  "emailVerified" BOOLEAN DEFAULT FALSE,
  "verificationToken" TEXT,
  "resetToken" TEXT,
  "resetTokenExp" TIMESTAMP,
  "companyId" TEXT,
  "committeeId" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL,
  FOREIGN KEY ("committeeId") REFERENCES "Committee"("id") ON DELETE SET NULL
);

-- ======================================================
-- TABELLA GAME
-- ======================================================
CREATE TABLE "Game" (
  "id" TEXT PRIMARY KEY,
  "number" TEXT NOT NULL,
  "dayName" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "timeStr" TEXT NOT NULL,
  "venue" TEXT NOT NULL,
  "status" "GameStatus" DEFAULT 'IN_PROGRAMMA',
  "result" TEXT,
  "notes" TEXT,
  "categoryId" TEXT NOT NULL,
  "teamAId" TEXT,
  "teamBId" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "unique_game_per_category" UNIQUE ("categoryId", "number"),
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE,
  FOREIGN KEY ("teamAId") REFERENCES "Company"("id") ON DELETE SET NULL,
  FOREIGN KEY ("teamBId") REFERENCES "Company"("id") ON DELETE SET NULL
);

-- ======================================================
-- TABELLA REPORT
-- ======================================================
CREATE TABLE "Report" (
  "id" TEXT PRIMARY KEY,
  "gameId" TEXT UNIQUE NOT NULL,
  "fileKey" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "uploadedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE,
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE
);
