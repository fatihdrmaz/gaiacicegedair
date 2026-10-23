import { NextResponse } from "next/server";
import { loadPackages } from "@/lib/b2c-packages-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const packages = await loadPackages();
  return NextResponse.json({ packages });
}
