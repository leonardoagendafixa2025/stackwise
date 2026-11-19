export type UserRole = "owner" | "admin" | "editor" | "agent";

export type AffiliateStatus =
  | "discovered"
  | "under_review"
  | "application_pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "terminated";

export type CommissionStatus = "pending" | "approved" | "paid" | "reversed";

export type AgentTaskStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "needs_review";

export type ContentStatus = "draft" | "in_review" | "published" | "archived";

export type ContentType =
  | "software_review"
  | "comparison"
  | "alternatives"
  | "guide"
  | "listicle"
  | "institutional";

export type LeadStatus =
  | "new"
  | "qualified"
  | "briefing_ready"
  | "accepted"
  | "declined";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_pt: string;
  name_en: string;
  description_pt: string | null;
  description_en: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  short_description_pt: string;
  short_description_en: string;
  full_description_pt: string | null;
  full_description_en: string | null;
  category_id: string;
  category?: Category;
  official_website: string;
  free_plan_available: boolean;
  free_trial_days: number | null;
  rating_editorial: number;
  last_verified_at: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFeature {
  id: string;
  product_id: string;
  feature_key: string;
  name_pt: string;
  name_en: string;
  is_supported: boolean;
  notes: string | null;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  plan_name: string;
  price: number;
  currency: string;
  billing_cycle: "monthly" | "annually" | "one_time" | "free";
  features: string[];
  has_free_trial: boolean;
  trial_days: number | null;
  is_active: boolean;
  verified_at: string;
}

export interface ProductSource {
  id: string;
  product_id: string;
  source_name: string;
  source_url: string;
  verified_by: string;
  verified_at: string;
  notes: string | null;
}

export interface AffiliateNetwork {
  id: string;
  name: string;
  portal_url: string | null;
  notes: string | null;
  is_active: boolean;
}

export interface AffiliateProgram {
  id: string;
  network_id: string | null;
  network?: AffiliateNetwork;
  name: string;
  product_id: string | null;
  product?: Product;
  official_terms_url: string | null;
  commission_rate: string;
  commission_type: "percentage" | "fixed" | "hybrid";
  is_recurring: boolean;
  cookie_duration_days: number | null;
  payout_method: string | null;
  min_payout: number | null;
  status: AffiliateStatus;
  reviewed_at: string | null;
}

export interface AffiliateLink {
  id: string;
  program_id: string;
  program?: AffiliateProgram;
  product_id: string;
  product?: Product;
  internal_slug: string;
  destination_url: string;
  is_active: boolean;
  created_at: string;
}

export interface AffiliateClick {
  id: string;
  link_id: string;
  product_id: string;
  referer: string | null;
  user_agent: string | null;
  device_type: string | null;
  country_code: string | null;
  created_at: string;
}

export interface AffiliateConversion {
  id: string;
  link_id: string;
  external_conversion_id: string | null;
  amount: number;
  commission_amount: number;
  currency: string;
  status: CommissionStatus;
  conversion_date: string;
  reported_at: string;
}

export interface Content {
  id: string;
  slug: string;
  type: ContentType;
  primary_product_id: string | null;
  secondary_product_id: string | null;
  target_category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentTranslation {
  id: string;
  content_id: string;
  locale: "pt-br" | "en";
  title: string;
  meta_title: string;
  meta_description: string;
  content_markdown: string;
  status: ContentStatus;
  published_at: string | null;
  updated_at: string;
}

export interface AgentDefinition {
  id: string;
  code: string;
  name: string;
  role_description: string;
  is_active: boolean;
  hourly_rate_limit: number;
  daily_token_cap: number;
  current_daily_tokens: number;
}

export interface AgentTask {
  id: string;
  agent_id: string;
  agent?: AgentDefinition;
  task_type: string;
  input_payload: Record<string, unknown>;
  output_payload: Record<string, unknown> | null;
  status: AgentTaskStatus;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  retry_count: number;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "critical";
  requires_attention: boolean;
  is_resolved: boolean;
  action_url: string | null;
  created_at: string;
}

export interface OperationalCost {
  id: string;
  service_name: string;
  plan_tier: string;
  cost_brl: number;
  billing_date: string | null;
  is_authorized: boolean;
  notes: string | null;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface ProjectLead {
  id: string;
  contact_name: string;
  contact_email: string;
  company_name: string | null;
  project_summary: string;
  budget_range: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface ProjectBriefing {
  id: string;
  lead_id: string;
  technical_scope: Record<string, unknown>;
  estimated_hours: number | null;
  complexity_level: "low" | "medium" | "high" | "enterprise";
  ai_recommendations: string[];
  generated_at: string;
}
