import { createAdminClient } from "@/lib/supabase/admin";

export interface AuditorResult {
  totalLinksChecked: number;
  healthyCount: number;
  issuesFoundCount: number;
  issues: {
    link_id: string;
    internal_slug: string;
    destination_url: string;
    http_status?: number;
    error_message?: string;
  }[];
}

export async function runAuditorAgent(): Promise<{
  data: AuditorResult;
  tokensUsed: number;
}> {
  const supabase = createAdminClient();

  // Fetch all active affiliate links
  const { data: links, error } = await supabase
    .from("affiliate_links")
    .select("id, internal_slug, destination_url")
    .eq("is_active", true);

  if (error || !links) {
    return {
      data: {
        totalLinksChecked: 0,
        healthyCount: 0,
        issuesFoundCount: 0,
        issues: [],
      },
      tokensUsed: 20,
    };
  }

  const issues: AuditorResult["issues"] = [];
  let healthy = 0;

  // Check each URL via HEAD/GET request
  for (const l of links) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(l.destination_url, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          "User-Agent": "STACKWISE-Link-Auditor/1.0 (+https://stackwise.io)",
        },
      });

      clearTimeout(timeoutId);

      // Status 200, 301, 302, 307, 308 are healthy responses
      if (res.status >= 200 && res.status < 400) {
        healthy += 1;
      } else {
        issues.push({
          link_id: l.id,
          internal_slug: l.internal_slug,
          destination_url: l.destination_url,
          http_status: res.status,
          error_message: `Status HTTP anômalo: ${res.status}`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Timeout na conexão";
      issues.push({
        link_id: l.id,
        internal_slug: l.internal_slug,
        destination_url: l.destination_url,
        error_message: msg,
      });
    }
  }

  // If issues found, create a notification in database
  if (issues.length > 0) {
    await supabase.from("notifications").insert({
      type: "AUDIT_LINK_ISSUE",
      title: `${issues.length} Link(s) com Problemas Identificados`,
      message: `O Agente 4 (Auditor) detectou falhas ao acessar links de parceiros: ${issues.map((i) => i.internal_slug).join(", ")}.`,
      severity: "warning",
      requires_attention: true,
      action_url: "/admin/affiliates",
    });
  }

  return {
    data: {
      totalLinksChecked: links.length,
      healthyCount: healthy,
      issuesFoundCount: issues.length,
      issues,
    },
    tokensUsed: 35,
  };
}
