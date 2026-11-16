import { NextResponse } from "next/server";
import { loadConcepts, loadPackages } from "@/lib/b2c-packages-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [packages, concepts] = await Promise.all([loadPackages(), loadConcepts()]);
  return NextResponse.json({ packages, concepts });
}
