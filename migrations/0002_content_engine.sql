-- =========================================================================
-- CAMBODIA INBOUND CONTENT ENGINE: SUPABASE MIGRATION (v2.4)
-- =========================================================================
--
-- Ported from the Supabase migration v2.4 so the SAME schema applies on this
-- workspace's Postgres: the embedded PGLite preview and the Neon production
-- database (both applied from `migrations/*.sql`). See src/lib/db.ts.
--
-- Everything schema-side is identical to the Supabase original (tables,
-- constraints, triggers, views, indexes, RLS). Only the platform-specific
-- pieces are made portable so a non-Supabase Postgres can still run the file:
--   * `pg_trgm`            -> created only if available (trigram indexes guarded)
--   * `anon` / `authenticated` / `service_role` roles -> role-scoped GRANTs and
--     RLS policies are applied only when those Supabase roles already exist.
--   * `pg_cron`            -> the 180-day retention schedule is registered only
--     when the extension is installed.
-- On a real Supabase project all three are present, so the file behaves exactly
-- like the v2.4 original.
--
-- NOTE: RLS is enabled on every table. Application queries run as the table
-- owner (which bypasses RLS), so the public read gates are ALSO expressed in
-- the queries themselves — see frontend/lib/server/content.ts.
-- =========================================================================

-- 1. EXTENSIONS & SEARCH PATH
DO $ext$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'pg_trgm') THEN
		CREATE EXTENSION IF NOT EXISTS pg_trgm;
	ELSE
		RAISE NOTICE 'pg_trgm unavailable; trigram search indexes will be skipped.';
	END IF;
EXCEPTION WHEN OTHERS THEN
	RAISE NOTICE 'pg_trgm could not be created (%); trigram search indexes will be skipped.', SQLERRM;
END;
$ext$;

-- =========================================================================
-- 2. CORE TABLES
-- =========================================================================

-- Authors & Reviewers (E-E-A-T Compliance)
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Locations (Hierarchical Geography: Country -> Province -> District -> Sangkat)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    aliases TEXT[] DEFAULT '{}',
    parent_id UUID REFERENCES locations(id) ON DELETE RESTRICT,
    level TEXT CHECK (level IN ('country', 'province', 'district', 'sangkat')) NOT NULL DEFAULT 'sangkat',
    parent_region TEXT NOT NULL DEFAULT 'Phnom Penh',
    vibe_tags TEXT[] DEFAULT '{}',
    rent_range_studio NUMERIC(10, 2),
    rent_range_1br NUMERIC(10, 2),
    rent_range_2br NUMERIC(10, 2),
    walkability_score INTEGER CHECK (walkability_score BETWEEN 1 AND 100),
    utility_notes TEXT,
    summary_mdx TEXT,
    is_indexable BOOLEAN DEFAULT false,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Venues (Programmatic Directory with Map Geo & Workflow Stub Safety)
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('coworking', 'clinic', 'apartment', 'cafe', 'visa_agent')) NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE RESTRICT,

    -- Map & Content Assets
    latitude NUMERIC(9,6) CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    longitude NUMERIC(9,6) CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
    description_mdx TEXT,
    website_url TEXT,
    primary_photo_url TEXT,
    photos JSONB DEFAULT '[]'::jsonb,

    -- Operational Details (Cambodia Specific)
    verified_wifi_mbps INTEGER,
    has_generator BOOLEAN DEFAULT false,
    price_tier INTEGER CHECK (price_tier BETWEEN 1 AND 4),
    opening_hours JSONB DEFAULT '{}'::jsonb,
    contact_info JSONB DEFAULT '{}'::jsonb,

    status TEXT CHECK (status IN ('active', 'closed', 'unverified')) DEFAULT 'unverified',
    verification_source TEXT,
    verified_by UUID REFERENCES authors(id),
    completeness_score INTEGER DEFAULT 0 CHECK (completeness_score BETWEEN 0 AND 100),
    last_verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    CONSTRAINT chk_active_requires_verification
        CHECK (status <> 'active' OR (verification_source IS NOT NULL AND last_verified_at IS NOT NULL)),
    CONSTRAINT chk_active_requires_description
        CHECK (status <> 'active' OR (description_mdx IS NOT NULL AND LENGTH(description_mdx) > 100))
);

-- Guides (Editorial Hubs & Spokes with Auto-Publish Timestamps & SEO Gates)
CREATE TABLE guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    pillar TEXT CHECK (pillar IN ('visit', 'live')) NOT NULL,
    title TEXT NOT NULL,
    mdx_content TEXT NOT NULL,
    schema_type TEXT CHECK (schema_type IN ('Article', 'FAQPage', 'HowTo')) DEFAULT 'Article',

    -- Publishing & SEO
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    noindex BOOLEAN DEFAULT false,
    related_guide_ids UUID[] DEFAULT '{}',

    author_id UUID REFERENCES authors(id),
    reviewer_id UUID REFERENCES authors(id),
    official_sources JSONB DEFAULT '[]'::jsonb,
    requires_legal_disclaimer BOOLEAN DEFAULT false,

    last_reviewed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    next_review_due_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- CTA Modules (Database-Driven Conversion Layer)
CREATE TABLE cta_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placement_tag TEXT NOT NULL,
    locale TEXT DEFAULT 'en',
    offer_type TEXT CHECK (offer_type IN ('newsletter', 'lead_form', 'affiliate', 'digital_product')) NOT NULL,
    variant_name TEXT DEFAULT 'default',
    priority INTEGER DEFAULT 0,
    weight INTEGER DEFAULT 100,

    headline TEXT NOT NULL,
    description TEXT,
    button_text TEXT NOT NULL DEFAULT 'Learn More',
    image_url TEXT,
    destination_url TEXT NOT NULL,

    experiment_id TEXT,
    analytics_event_name TEXT NOT NULL,
    fallback_cta_id UUID REFERENCES cta_modules(id),

    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    CONSTRAINT chk_no_self_fallback CHECK (fallback_cta_id IS NULL OR fallback_cta_id <> id)
);

-- Analytics & Audit Trails
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    placement_tag TEXT,
    cta_id UUID REFERENCES cta_modules(id) ON DELETE SET NULL,
    session_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    CONSTRAINT chk_event_name CHECK (event_name IN (
        'tool_started', 'tool_completed', 'export_requested', 'email_submitted',
        'cta_click', 'cta_impression', 'directory_filter_used', 'map_opened'
    )),
    CONSTRAINT chk_session_id_length CHECK (session_id IS NULL OR octet_length(session_id) <= 64),
    CONSTRAINT chk_metadata_size CHECK (octet_length(metadata::text) < 8192)
);

CREATE TABLE content_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
    guide_slug TEXT,
    reviewer_id UUID REFERENCES authors(id),
    outcome TEXT CHECK (outcome IN ('approved', 'needs_update', 'deprecated')) NOT NULL,
    notes TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE content_reviews IS 'Internal audit trail. RLS enabled with no policies = service_role only by design.';

-- Redirects Table for SEO URL Refactoring
CREATE TABLE redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_path TEXT UNIQUE NOT NULL,
    to_path TEXT NOT NULL,
    status_code INTEGER DEFAULT 301 CHECK (status_code IN (301, 302, 308)),
    reason TEXT,
    hit_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE redirects IS 'SEO redirects. RLS enabled with no policies = service_role only by design (framework middleware reads via service_role).';

-- =========================================================================
-- 3. FUNCTIONS & TRIGGERS (With Pinned search_path)
-- =========================================================================

-- Category-aware completeness scorer
CREATE OR REPLACE FUNCTION compute_venue_completeness()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    IF NEW.name IS NOT NULL AND LENGTH(NEW.name) > 0 THEN score := score + 15; END IF;
    IF NEW.category IS NOT NULL THEN score := score + 10; END IF;
    IF NEW.location_id IS NOT NULL THEN score := score + 15; END IF;
    IF NEW.description_mdx IS NOT NULL AND LENGTH(NEW.description_mdx) > 100 THEN score := score + 15; END IF;
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN score := score + 10; END IF;

    IF NEW.category IN ('cafe', 'coworking') AND NEW.verified_wifi_mbps IS NOT NULL THEN
        score := score + 20;
    ELSIF NEW.category IN ('clinic', 'apartment', 'visa_agent') AND coalesce(NEW.opening_hours, '{}'::jsonb) <> '{}'::jsonb THEN
        score := score + 20;
    END IF;

    IF NEW.last_verified_at IS NOT NULL AND NEW.last_verified_at > (now() - interval '90 days') THEN
        score := score + 15;
    END IF;

    NEW.completeness_score := score;
    NEW.updated_at := now();

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_venues_completeness
    BEFORE INSERT OR UPDATE ON venues
    FOR EACH ROW
    EXECUTE FUNCTION compute_venue_completeness();

-- Location Indexability Trigger
CREATE OR REPLACE FUNCTION compute_location_indexability()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.is_indexable := (
    NEW.summary_mdx IS NOT NULL
    AND LENGTH(NEW.summary_mdx) > 200
    AND NEW.rent_range_1br IS NOT NULL
    AND NEW.walkability_score IS NOT NULL
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_locations_indexability
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION compute_location_indexability();

-- Guide Publish Timestamp Trigger (Safe for INSERT and UPDATE)
CREATE OR REPLACE FUNCTION compute_guide_publish_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.is_published
     AND NEW.published_at IS NULL
     AND (TG_OP = 'INSERT' OR OLD.is_published IS DISTINCT FROM true) THEN
    NEW.published_at := now();
  ELSIF NOT NEW.is_published THEN
    NEW.published_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guides_publish_ts
  BEFORE INSERT OR UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION compute_guide_publish_timestamp();

-- Guide Review Due Re-derivation Trigger (Safe for INSERT via TG_OP check)
CREATE OR REPLACE FUNCTION compute_guide_review_due()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.next_review_due_at := NEW.last_reviewed_at + interval '180 days';
  ELSIF NEW.last_reviewed_at IS DISTINCT FROM OLD.last_reviewed_at THEN
    NEW.next_review_due_at := NEW.last_reviewed_at + interval '180 days';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guides_review_due
  BEFORE INSERT OR UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION compute_guide_review_due();

-- Content Reviews Slug Preservation Trigger
CREATE OR REPLACE FUNCTION set_review_guide_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.guide_id IS NOT NULL AND NEW.guide_slug IS NULL THEN
    SELECT slug INTO NEW.guide_slug FROM guides WHERE id = NEW.guide_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_reviews_set_slug
  BEFORE INSERT OR UPDATE ON content_reviews
  FOR EACH ROW EXECUTE FUNCTION set_review_guide_slug();

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_cta_updated_at BEFORE UPDATE ON cta_modules FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- =========================================================================
-- 4. MONITORING VIEWS & CRON RETENTION
-- =========================================================================

CREATE OR REPLACE VIEW guides_freshness_view AS
SELECT id, slug, pillar, title, last_reviewed_at, next_review_due_at,
  CASE
    WHEN next_review_due_at IS NULL                       THEN 'UNSCHEDULED'
    WHEN next_review_due_at < now()                       THEN 'OVERDUE'
    WHEN next_review_due_at < now() + interval '14 days'  THEN 'DUE_SOON'
    ELSE 'FRESH'
  END AS freshness_status
FROM guides;

CREATE OR REPLACE VIEW stale_venues_view AS
SELECT v.id, v.slug, v.name, v.category, v.status, v.completeness_score, v.last_verified_at, l.name AS location_name
FROM venues v
LEFT JOIN locations l ON v.location_id = l.id
WHERE v.status <> 'closed'
  AND (v.last_verified_at IS NULL OR v.last_verified_at < (now() - interval '90 days') OR v.status = 'unverified');

-- Schedule analytics retention cleanup via pg_cron (requires pg_cron enabled).
DO $cron$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
		PERFORM cron.schedule(
			'analytics-retention',
			'0 4 * * *',
			$job$ DELETE FROM analytics_events WHERE created_at < now() - interval '180 days'; $job$
		);
	ELSE
		RAISE NOTICE 'pg_cron not installed; analytics retention schedule skipped.';
	END IF;
END;
$cron$;

-- =========================================================================
-- 5. ROW-LEVEL SECURITY (RLS) & EXPLICIT TO CLAUSES
-- =========================================================================

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE cta_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Public read/write policies and the explicit grants target Supabase's request
-- roles. Apply them only where those roles exist (a real Supabase project); a
-- plain Postgres has no anon/authenticated/service_role and would otherwise
-- fail — the app reads as the table owner and expresses the same gates in SQL.
DO $roles$
DECLARE
	has_public_roles boolean;
BEGIN
	SELECT (EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
	        AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated'))
	  INTO has_public_roles;

	IF NOT has_public_roles THEN
		RAISE NOTICE 'Supabase request roles (anon/authenticated) not present; skipping role-scoped policies and grants.';
		RETURN;
	END IF;

	EXECUTE $pol$ CREATE POLICY "Public read authors" ON authors
	    FOR SELECT TO anon, authenticated USING (true) $pol$;

	EXECUTE $pol$ CREATE POLICY "Public read locations" ON locations
	    FOR SELECT TO anon, authenticated USING (true) $pol$;

	EXECUTE $pol$ CREATE POLICY "Public read active venues with high completeness" ON venues
	    FOR SELECT TO anon, authenticated USING (
	        status = 'active'
	        AND last_verified_at IS NOT NULL
	        AND last_verified_at > now() - interval '90 days'
	        AND completeness_score >= 50
	    ) $pol$;

	EXECUTE $pol$ CREATE POLICY "Public read published guides" ON guides
	    FOR SELECT TO anon, authenticated USING (is_published = true) $pol$;

	EXECUTE $pol$ CREATE POLICY "Public read active cta modules" ON cta_modules
	    FOR SELECT TO anon, authenticated USING (
	        is_active = true
	        AND (start_date IS NULL OR start_date <= now())
	        AND (end_date IS NULL OR end_date >= now())
	    ) $pol$;

	EXECUTE $pol$ CREATE POLICY "Public insert analytics" ON analytics_events
	    FOR INSERT TO anon, authenticated WITH CHECK (true) $pol$;

	EXECUTE 'GRANT SELECT ON authors, locations, venues, guides, cta_modules TO anon, authenticated';
	EXECUTE 'GRANT INSERT ON analytics_events TO anon, authenticated';
END;
$roles$;

-- Restrict monitoring views strictly to service role (Supabase only).
DO $svc$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
		IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
			EXECUTE 'REVOKE ALL ON guides_freshness_view, stale_venues_view FROM anon, authenticated';
		END IF;
		EXECUTE 'GRANT SELECT ON guides_freshness_view, stale_venues_view TO service_role';
	END IF;
END;
$svc$;

-- =========================================================================
-- 6. PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX idx_venues_active_completeness ON venues (completeness_score DESC) WHERE status = 'active';
CREATE INDEX idx_venues_category_location ON venues(category, location_id);
CREATE INDEX idx_guides_review_due ON guides (next_review_due_at) WHERE next_review_due_at IS NOT NULL;
CREATE INDEX idx_cta_placement ON cta_modules(placement_tag, is_active, priority) WHERE is_active = true;
CREATE INDEX idx_locations_hierarchy ON locations(parent_id, level);
CREATE INDEX idx_events_name_time ON analytics_events (event_name, created_at DESC);
CREATE INDEX idx_events_created_at ON analytics_events (created_at);
CREATE INDEX idx_redirects_from ON redirects (from_path);

-- Trigram name search — only when pg_trgm loaded.
DO $trgm$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
		CREATE INDEX idx_venues_name_trgm ON venues USING gin (name gin_trgm_ops);
		CREATE INDEX idx_locations_name_trgm ON locations USING gin (name gin_trgm_ops);
	END IF;
END;
$trgm$;

ALTER TABLE guides
  ADD CONSTRAINT chk_published_requires_timestamp
  CHECK (NOT is_published OR published_at IS NOT NULL);
