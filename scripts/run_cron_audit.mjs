import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[CRON AUDITOR ERROR] Missing Supabase environment credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runScheduledAudit() {
  console.log("====================================================");
  console.log("  STACKWISE AUTONOMOUS SCHEDULED AUDITOR (CRON)     ");
  console.log(`  Execution Time: ${new Date().toISOString()}`);
  console.log("====================================================");

  // 1. Fetch Agent 4
  const { data: agent, error: agErr } = await supabase
    .from("agent_definitions")
    .select("*")
    .eq("code", "AGENT_4_AUDITOR")
    .single();

  if (agErr || !agent) {
    console.error("[CRON AUDITOR ERROR] Agent 4 definition not found:", agErr);
    process.exit(1);
  }

  // 2. Fetch active links
  const { data: links, error: linksErr } = await supabase
    .from("affiliate_links")
    .select("id, internal_slug, destination_url")
    .eq("is_active", true);

  if (linksErr || !links) {
    console.error("[CRON AUDITOR ERROR] Error fetching affiliate links:", linksErr);
    process.exit(1);
  }

  console.log(`Found ${links.length} active affiliate links to verify.`);

  const issues = [];
  let healthy = 0;

  for (const l of links) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(l.destination_url, {
        method: "HEAD",
        signal: controller.signal,
        headers: { "User-Agent": "STACKWISE-Scheduled-Auditor/1.0" },
      });

      clearTimeout(timeout);

      console.log(`- [${res.status}] ${l.internal_slug} -> ${l.destination_url}`);
      if (res.status >= 200 && res.status < 400) {
        healthy++;
      } else {
        issues.push({
          link_id: l.id,
          internal_slug: l.internal_slug,
          status: res.status,
          destination_url: l.destination_url,
        });
      }
    } catch (err) {
      console.warn(`- [FAIL] ${l.internal_slug}: ${err.message}`);
      issues.push({
        link_id: l.id,
        internal_slug: l.internal_slug,
        error: err.message,
        destination_url: l.destination_url,
      });
    }
  }

  // 3. Register Task in agent_tasks
  const { data: task, error: taskErr } = await supabase
    .from("agent_tasks")
    .insert({
      agent_id: agent.id,
      task_type: agent.code,
      input_payload: { trigger: "github_actions_cron" },
      status: "completed",
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      output_payload: {
        totalLinksChecked: links.length,
        healthyCount: healthy,
        issuesCount: issues.length,
        issues,
      },
    })
    .select()
    .single();

  if (taskErr) {
    console.error("[CRON AUDITOR ERROR] Error recording task:", taskErr);
  } else {
    console.log(`Recorded agent_task ID: ${task.id}`);
  }

  // 4. Register log in agent_logs
  if (task) {
    await supabase.from("agent_logs").insert({
      task_id: task.id,
      agent_code: agent.code,
      log_level: issues.length > 0 ? "warn" : "info",
      message: `Auditoria agendada concluída: ${healthy}/${links.length} links operacionais (${issues.length} alertas).`,
      context: { issues },
    });
  }

  // 5. Update or insert scheduled_jobs entry
  const { data: existingJob } = await supabase
    .from("scheduled_jobs")
    .select("id")
    .eq("name", "audit-affiliate-links")
    .maybeSingle();

  if (existingJob) {
    await supabase
      .from("scheduled_jobs")
      .update({
        last_run_at: new Date().toISOString(),
        status: issues.length > 0 ? "warning" : "completed",
      })
      .eq("id", existingJob.id);
  } else {
    await supabase.from("scheduled_jobs").insert({
      name: "audit-affiliate-links",
      cron_expression: "0 */12 * * *",
      agent_id: agent.id,
      is_active: true,
      last_run_at: new Date().toISOString(),
      status: issues.length > 0 ? "warning" : "completed",
    });
  }

  console.log("====================================================");
  console.log(`AUDIT COMPLETE: ${healthy} Healthy | ${issues.length} Issues`);
  console.log("====================================================");
}

runScheduledAudit();
