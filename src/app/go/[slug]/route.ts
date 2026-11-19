import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.redirect(new URL("/pt-br", request.url));
  }

  const supabase = createAdminClient();

  // Extract non-identifying telemetry
  const referer = request.headers.get("referer") || null;
  const userAgent = request.headers.get("user-agent") || null;
  const countryCode =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  // Classify device type purely in aggregate without tracking individual identity
  let deviceType = "desktop";
  if (userAgent) {
    if (/mobile/i.test(userAgent)) deviceType = "mobile";
    else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
  }

  try {
    // 1. Try atomic database resolution via RPC
    const { data, error } = await supabase.rpc("log_affiliate_click_and_resolve", {
      p_internal_slug: slug,
      p_referer: referer ? referer.substring(0, 500) : null,
      p_user_agent: userAgent ? userAgent.substring(0, 300) : null,
      p_device_type: deviceType,
      p_country_code: countryCode,
    });

    if (error || !data || data.length === 0 || !data[0]?.is_valid) {
      // Fallback query if RPC isn't deployed yet (e.g. dev mock environment)
      const { data: linkData } = await supabase
        .from("affiliate_links")
        .select("destination_url, is_active, products(name)")
        .eq("internal_slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (linkData?.destination_url) {
        return NextResponse.redirect(linkData.destination_url, {
          status: 307,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }

      // If link slug not found, redirect to catalog
      return NextResponse.redirect(new URL(`/pt-br/categories`, request.url));
    }

    const destinationUrl = data[0].destination_url;

    // HTTP 307: Temporary Redirect preserving method, with strict no-cache to guarantee click audit
    return NextResponse.redirect(destinationUrl, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (err) {
    console.error("[STACKWISE REDIRECTOR ERROR]", err);
    return NextResponse.redirect(new URL(`/pt-br`, request.url));
  }
}
