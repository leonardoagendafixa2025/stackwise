import { NextRequest, NextResponse } from "next/server";
import { executeAgentTask } from "@/services/agentRunner";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentCode, inputPayload } = body;

    if (!agentCode) {
      return NextResponse.json(
        { error: "agentCode é obrigatório." },
        { status: 400 }
      );
    }

    const result = await executeAgentTask(agentCode, inputPayload || {});
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao executar agente";
    console.error("[AGENT RUN API ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
