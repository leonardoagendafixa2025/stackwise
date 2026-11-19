import { NextRequest, NextResponse } from "next/server";
import { importCommissionsCSV } from "@/services/financial";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvContent } = body;

    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json(
        { error: "O conteúdo CSV é obrigatório." },
        { status: 400 }
      );
    }

    const result = await importCommissionsCSV(csvContent);
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao importar CSV de comissões";
    console.error("[FINANCIAL CSV IMPORT ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
