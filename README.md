# REFERTIMINI
**Powered by Informatica Comense**

Gestione referti PDF per Minibasket con gerarchia **Stagione → Comitato → Società/Categorie → Gare → Referti**,
verifica email, reset password, ACL per comitato, import CSV, sollecito automatico, logo per comitato.

## Setup locale
1. `cp .env.example .env` e compila i valori (DB `referti-minibasket`)
2. `npm ci`
3. `npx prisma migrate dev --name init`
4. `npm run seed` (crea superadmin: admin@test.it / Mujanovic1!)
5. `npm run dev`

## Deploy su Render
- Crea PostgreSQL **referti-minibasket** (EU Frankfurt)
- Web Service collegato a GitHub
- Persistent Disk 5GB su `/data`
- Env vars: `DATABASE_URL`, `SUPERADMIN_*`, `SMTP_*`, `MAIL_*`, `CRON_TOKEN`
- Cron: chiama `/api/cron/check-missing-reports?token=...` alle 08:00 Europe/Rome

## CSV richiesto
`NUMERO GARA, GIORNO, DATA (dd/MM/yyyy), CATEGORIA, GIRONE, ORA, CAMPO DI GIOCO, SQUADRA A, SQUADRA B`
