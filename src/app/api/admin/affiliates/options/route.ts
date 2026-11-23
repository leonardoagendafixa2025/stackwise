import { NextResponse } from "next/server";
import { getAffiliateNetworks } from "@/services/affiliate";
import { getProducts } from "@/services/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [networks, products] = await Promise.all([
      getAffiliateNetworks(),
      getProducts({ publishedOnly: false }),
    ]);

    return NextResponse.json({ networks, products });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
