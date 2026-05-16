import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isPortalProtected =
    pathname.startsWith("/portal/dashboard") ||
    pathname.startsWith("/portal/takvim") ||
    pathname.startsWith("/portal/siparisler") ||
    pathname.startsWith("/portal/adresler") ||
    pathname.startsWith("/portal/calisanlar") ||
    pathname.startsWith("/portal/faturalama") ||
    pathname.startsWith("/portal/raporlar");

  const isAdmin = pathname.startsWith("/admin");

  if ((isPortalProtected || isAdmin) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/giris";
    return NextResponse.redirect(url);
  }

  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/portal/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
