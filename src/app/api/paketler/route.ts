import { NextResponse } from "next/server";
import { loadConcepts, loadDesigns, loadPackages } from "@/lib/b2c-packages-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [packages, concepts, designs] = await Promise.all([loadPackages(), loadConcepts(), loadDesigns()]);
  return NextResponse.json({ packages, concepts, designs });
}
