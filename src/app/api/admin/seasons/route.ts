import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ usa default import, coerente con lib/prisma.ts

// ============================================================
// 🔹 GET – Tutte le stagioni (ordinate per data di inizio)
// ============================================================
export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json(seasons);
  } catch (error) {
    console.error("❌ Errore GET /api/admin/seasons:", error);
    return NextResponse.json(
      { error: "Errore durante il caricamento delle stagioni." },
      { status: 500 }
    );
  }
}

// ============================================================
// 🔹 POST – Crea una nuova stagione
// ============================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, startDate, endDate, isActive } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Campi obbligatori mancanti: name, startDate, endDate" },
        { status: 400 }
      );
    }

    const season = await prisma.season.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ...(isActive !== undefined && { isActive }), // ✅ supporta flag opzionale
      },
    });

    return NextResponse.json(season);
  } catch (error: any) {
    console.error("❌ Errore POST /api/admin/seasons:", error);

    // Prisma unique constraint
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Una stagione con questo nome esiste già." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Errore durante la creazione della stagione." },
      { status: 500 }
    );
  }
}

// ============================================================
// 🔹 DELETE – Elimina una stagione tramite query ?id=
// ============================================================
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Parametro 'id' mancante nella richiesta." },
        { status: 400 }
      );
    }

    await prisma.season.delete({ where: { id } });
    return NextResponse.json({ message: "✅ Stagione eliminata con successo." });
  } catch (error) {
    console.error("❌ Errore DELETE /api/admin/seasons:", error);
    return NextResponse.json(
      { error: "Errore durante l'eliminazione della stagione." },
      { status: 500 }
    );
  }
}

