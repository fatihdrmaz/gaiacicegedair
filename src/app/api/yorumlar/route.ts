import { NextResponse } from "next/server";

// Google yorumları — Places API (v1). Saatte bir önbelleğe alınır.
export const revalidate = 3600;

type GReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; photoUri?: string };
};

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  const empty = { reviews: [], rating: 0, total: 0, mapsUrl: "" };

  if (!key || !placeId) return NextResponse.json(empty);

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=tr`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) {
      console.error("[yorumlar] Places API hatası:", res.status, await res.text());
      return NextResponse.json(empty);
    }
    const data = await res.json();
    const reviews = ((data.reviews || []) as GReview[]).map((r) => ({
      author: r.authorAttribution?.displayName || "Google Kullanıcısı",
      photo: r.authorAttribution?.photoUri || "",
      rating: r.rating || 5,
      text: r.text?.text || r.originalText?.text || "",
      time: r.relativePublishTimeDescription || "",
    }));
    return NextResponse.json({
      reviews,
      rating: data.rating || 0,
      total: data.userRatingCount || 0,
      mapsUrl: data.googleMapsUri || "",
    });
  } catch (err) {
    console.error("[yorumlar] hata:", err);
    return NextResponse.json(empty);
  }
}
