-- =========================================================================
-- CONTENT ENGINE SEED — sample records shaped like the production directory
-- =========================================================================
--
-- Idempotent: every row has a fixed id and `ON CONFLICT DO NOTHING`, so the
-- file is safe to re-apply. Verification and review timestamps are relative to
-- `now()` so the recency gates (90-day venue verification, 180-day guide
-- review) stay satisfied however long after the seed the app is viewed.
-- =========================================================================

-- Authors / reviewers (E-E-A-T)
INSERT INTO authors (id, name, slug, avatar_url, bio) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Editorial desk', 'editorial-desk', NULL,
   'Writes and maintains the Phnom Penh guides. Every detail is re-checked on a six-month clock.'),
  ('11111111-1111-4111-8111-111111111112', 'Sokha Chan', 'sokha-chan', NULL,
   'Reviews the healthcare and visa notes against current official sources before publication.')
ON CONFLICT DO NOTHING;

-- Locations: country -> province -> sangkat (hierarchy + auto is_indexable)
INSERT INTO locations (id, slug, name, aliases, parent_id, level, parent_region, vibe_tags,
  rent_range_studio, rent_range_1br, rent_range_2br, walkability_score, utility_notes, summary_mdx,
  last_verified_at) VALUES
  ('22222222-2222-4222-8222-222222222201', 'cambodia', 'Cambodia', '{}', NULL, 'country', 'Cambodia',
   '{}', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('22222222-2222-4222-8222-222222222202', 'phnom-penh', 'Phnom Penh', '{"PP"}',
   '22222222-2222-4222-8222-222222222201', 'province', 'Cambodia', '{}', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('22222222-2222-4222-8222-222222222203', 'bkk1', 'BKK1', '{"Boeng Keng Kang 1"}',
   '22222222-2222-4222-8222-222222222202', 'sangkat', 'Phnom Penh', '{"walkable","dense","cafes"}',
   420, 650, 980, 82,
   'Street power is steadier than the side streets; confirm which floors a building''s backup reaches.',
   'The usual landing neighbourhood. Cafés, clinics, and coworking sit within a few blocks, and one-bedroom rents cluster around the mid-six hundreds when the building has a generator. Power is steadier than the side streets, but ask which floors the backup reaches before you sign anything.',
   now() - interval '20 days'),
  ('22222222-2222-4222-8222-222222222204', 'toul-tom-poung', 'Toul Tom Poung', '{"Russian Market"}',
   '22222222-2222-4222-8222-222222222202', 'sangkat', 'Phnom Penh', '{"markets","quieter","local"}',
   340, 520, 820, 74,
   'Power cuts are less predictable on the side streets; ask about the generator before signing.',
   'A step down in rent from BKK1 with most daily needs still on foot. Power cuts are less predictable on the side streets, so ask about the generator before you sign. Russian Market sits at the edge, which makes mornings easy and afternoons hot.',
   now() - interval '26 days'),
  ('22222222-2222-4222-8222-222222222205', 'daun-penh', 'Daun Penh', '{"Riverside"}',
   '22222222-2222-4222-8222-222222222202', 'sangkat', 'Phnom Penh', '{"riverside","visa-errands","older"}',
   380, 580, 900, 78,
   'Riverside towers usually carry backup power; older shophouses often do not.',
   'The riverfront and the administrative core. Useful if you want to be near the palace-side clinics and visa offices, and noisier in the evening along the quay. Most visa errands are walkable from here, which is the main reason to pay the premium.',
   now() - interval '18 days'),
  ('22222222-2222-4222-8222-222222222206', 'chroy-changvar', 'Chroy Changvar', '{"Chroy Changva"}',
   '22222222-2222-4222-8222-222222222202', 'sangkat', 'Phnom Penh', '{"newer","towers","quiet"}',
   500, 700, 1050, 46,
   'Managed towers carry building power; low-rise streets outside them are less forgiving.',
   'Larger apartments and more reliable building power, at the cost of a bridge crossing for almost everything. Treat walkability scores here as building-to-building rather than neighbourhood-wide, and check how a tower''s backup power behaves before committing to a long lease.',
   now() - interval '33 days')
ON CONFLICT DO NOTHING;

-- Branch venues (the directory). Active rows satisfy the DB gates: verification
-- source + recent timestamp + a description over 100 characters.
INSERT INTO venues (id, slug, name, category, location_id, latitude, longitude, description_mdx,
  website_url, primary_photo_url, verified_wifi_mbps, has_generator, price_tier, opening_hours,
  status, verification_source, verified_by, last_verified_at) VALUES
  ('33333333-3333-4333-8333-333333333301', 'pavilion-work', 'Pavilion Work', 'coworking',
   '22222222-2222-4222-8222-222222222203', 11.546600, 104.928200,
   'Day passes and monthly desks in a low-rise on the BKK1 grid. The generator covers the whole work floor, and the last measured download was 180 Mbps on a weekday afternoon.',
   NULL, '/cowork.jpg', 180, true, 3, '{}'::jsonb,
   'active', 'on-site visit', '11111111-1111-4111-8111-111111111111', now() - interval '20 days'),

  ('33333333-3333-4333-8333-333333333302', 'lane-house', 'Lane House', 'cafe',
   '22222222-2222-4222-8222-222222222203', NULL, NULL,
   'A two-hour café rather than a day office. The Wi-Fi holds for calls until the street power drops, and there is no generator, so plan a backup for long work sessions.',
   NULL, '/riverside.jpg', 70, false, 2, '{}'::jsonb,
   'active', 'on-site visit', '11111111-1111-4111-8111-111111111111', now() - interval '35 days'),

  ('33333333-3333-4333-8333-333333333303', 'riverside-annex', 'Riverside Annex', 'cafe',
   '22222222-2222-4222-8222-222222222205', NULL, NULL,
   'A quieter upstairs room facing away from the quay. The generator is building-wide rather than café-only, which keeps the router up when the street supply drops.',
   NULL, '/riverside.jpg', 45, true, 2, '{}'::jsonb,
   'active', 'on-site visit', '11111111-1111-4111-8111-111111111111', now() - interval '45 days'),

  ('33333333-3333-4333-8333-333333333304', 'clinic-240', 'Clinic 240', 'clinic',
   '22222222-2222-4222-8222-222222222205', NULL, NULL,
   'International outpatient clinic with English-speaking reception on weekdays. Confirm specialist hours the morning you go, and bring your passport and insurance details to the first visit.',
   NULL, NULL, NULL, true, 3, '{"mon-fri":"08:00-17:30","sat":"08:00-12:00"}'::jsonb,
   'active', 'phone confirmation', '11111111-1111-4111-8111-111111111112', now() - interval '12 days'),

  ('33333333-3333-4333-8333-333333333305', 'sangkum-lofts', 'Sangkum Lofts', 'apartment',
   '22222222-2222-4222-8222-222222222204', NULL, NULL,
   'One-bedrooms in a low-rise with a shared generator. Ask which floors the backup actually reaches before you sign, and photograph the meter reading on the day you receive keys.',
   NULL, NULL, NULL, true, 2, '{"viewings":"09:00-17:00"}'::jsonb,
   'active', 'on-site visit', '11111111-1111-4111-8111-111111111111', now() - interval '25 days'),

  ('33333333-3333-4333-8333-333333333306', 'mekong-visa-desk', 'Mekong Visa Desk', 'visa_agent',
   '22222222-2222-4222-8222-222222222205', NULL, NULL,
   'Ordinary extension and business-visa paperwork handled at a walk-in desk. They do not replace the official fee schedule, so compare the posted fees before you pay a service charge.',
   NULL, NULL, NULL, false, 2, '{"mon-fri":"08:30-17:00"}'::jsonb,
   'active', 'walk-in visit', '11111111-1111-4111-8111-111111111112', now() - interval '8 days'),

  ('33333333-3333-4333-8333-333333333307', 'bridge-rooms', 'Bridge Rooms', 'coworking',
   '22222222-2222-4222-8222-222222222206', 11.583300, 104.930000,
   'A fast fibre line and building-wide backup power across the bridge. The commute is the real cost of the desk, not the membership, so trial the crossing at rush hour first.',
   NULL, '/cowork.jpg', 220, true, 3, '{}'::jsonb,
   'active', 'on-site visit', '11111111-1111-4111-8111-111111111111', now() - interval '60 days'),

  ('33333333-3333-4333-8333-333333333308', 'market-edge-flats', 'Market Edge Flats', 'apartment',
   '22222222-2222-4222-8222-222222222203', NULL, NULL,
   'Furnished one-bedrooms without a generator. Fine if you work elsewhere during outages and poor if you do not; the listing stays unverified until a fresh inspection is completed.',
   NULL, NULL, NULL, false, 3, '{}'::jsonb,
   'unverified', NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Editorial guides (published spokes). Body is MDX; '## ' starts a section.
INSERT INTO guides (id, slug, pillar, title, mdx_content, schema_type, is_published,
  meta_title, meta_description, author_id, reviewer_id, official_sources, requires_legal_disclaimer,
  last_reviewed_at) VALUES
  ('44444444-4444-4444-8444-444444444401', 'first-ninety-days', 'live',
   'The first ninety days of a lease in Phnom Penh',
   '## Read the power note before the view

A one-bedroom price without a generator is not comparable to one with building backup. Ask which floors the generator covers, how long it runs, and whether the elevator is on the same circuit.

If the answer is vague, treat the unit as unpowered during outages and price your coworking days into the rent.

## Deposit, inventory, and the name on the contract

Pay the deposit against a written inventory, including air-conditioners and the water heater. Photograph meter readings on the day you receive keys.

The name on the lease should match the person who can return the deposit. If an agent is in the middle, write their role into the document rather than assuming it.

## What can wait

Furnishing beyond a bed and a desk can wait. A local SIM and a clinic you have actually walked to should not. Register the address you will use for visa paperwork before you start an extension, not the week it is due.',
   'Article', true,
   'The first ninety days of a lease in Phnom Penh',
   'What to confirm before you transfer a deposit, and what can wait until the second month.',
   '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111112', '[]'::jsonb, false,
   now() - interval '30 days'),

  ('44444444-4444-4444-8444-444444444402', 'generators-and-neighbourhoods', 'live',
   'How generator coverage changes a neighbourhood',
   '## Three different promises

A café "with a generator" may mean the espresso machine stays on and the Wi-Fi does not. A coworking floor usually means desks, routers, and air-conditioning. A condo may mean common areas only.

The directory records a single yes or no, plus the verification date. Read the note on the venue before you plan a workday around it.

## Where it matters most

BKK1 and Daun Penh have enough backup options that a single outage is an inconvenience. Side streets in Toul Tom Poung and most of Chroy Changvar outside a managed tower are less forgiving.

If your work cannot pause, pick the building first and the street second.',
   'Article', true,
   'How generator coverage changes a neighbourhood',
   'Walkability scores do not capture the afternoon the street power drops.',
   '11111111-1111-4111-8111-111111111111', NULL, '[]'::jsonb, false,
   now() - interval '45 days'),

  ('44444444-4444-4444-8444-444444444403', 'five-days-without-logistics', 'visit',
   'Five days that do not disappear into logistics',
   '## Stay on one side of the river

Unless you have a reason to be in Chroy Changvar, sleep in Daun Penh or BKK1. The bridge is a poor use of a five-day trip.

Book a clinic-adjacent hotel only if someone in the party needs it. Otherwise the riverfront is enough orientation for the first evening.

## Two bases, not five pins

Use Daun Penh for the river, the palace-side walks, and any visa errand you cannot avoid. Use BKK1 for meals and a long work block if you are not fully offline.

Russian Market is a morning, not a day. Leave before the heat settles and do not schedule anything that requires punctuality afterwards.

## What to skip

Do not spend a day "figuring out SIM cards and cash" if you can do both in an hour on arrival. Do not stack a border run and a day trip. The point of a short visit is one unhurried neighbourhood, not complete coverage.',
   'Article', true,
   'Five days that do not disappear into logistics',
   'A short stay organised around neighbourhoods, not a checklist of sights.',
   '11111111-1111-4111-8111-111111111111', NULL, '[]'::jsonb, false,
   now() - interval '50 days'),

  ('44444444-4444-4444-8444-444444444404', 'arriving-with-a-deadline', 'visit',
   'Arriving when you already have a deadline',
   '## Put the appointment on the map first

Stay in the same sangkat as the office or clinic if the appointment is before 10:00. Traffic across town is not a reliable thirty minutes.

Visa agents in Daun Penh are convenient for the administrative offices and inconvenient for everything else. That trade is worth it for one or two days, not for a week of evenings.

## Paper, then the city

Finish the errand on day one or day two. The rest of the stay can be ordinary: one neighbourhood on foot, one long lunch, an early night before a flight.

If the office asks for a document you do not have, you want that discovery on the first morning, not the afternoon before you leave.',
   'Article', true,
   'Arriving when you already have a deadline',
   'If a visa date or a clinic appointment is the reason for the trip, organise the city around that hour.',
   '11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111112', '[]'::jsonb, true,
   now() - interval '62 days')
ON CONFLICT DO NOTHING;

-- Conversion modules (database-driven CTA layer)
INSERT INTO cta_modules (id, placement_tag, offer_type, variant_name, priority, weight, headline,
  description, button_text, destination_url, analytics_event_name, is_active) VALUES
  ('55555555-5555-4555-8555-555555555501', 'guide_spoke_footer', 'newsletter', 'default', 10, 100,
   'The monthly Phnom Penh brief', 'One email a month: rent moves, power notes, and paperwork changes.',
   'Subscribe', '/visit', 'email_submitted', true),
  ('55555555-5555-4555-8555-555555555502', 'directory_sidebar', 'affiliate', 'default', 5, 100,
   'Planning a visa errand?', 'Read the deadline guide before you book an agent.',
   'Read the guide', '/visit/arriving-with-a-deadline', 'cta_click', true)
ON CONFLICT DO NOTHING;

-- One review record so the audit trail is not empty.
INSERT INTO content_reviews (id, guide_id, guide_slug, reviewer_id, outcome, notes, reviewed_at) VALUES
  ('66666666-6666-4666-8666-666666666601', '44444444-4444-4444-8444-444444444401', 'first-ninety-days',
   '11111111-1111-4111-8111-111111111112', 'approved',
   'Rent and power notes re-checked against a fresh walk-through.', now() - interval '30 days')
ON CONFLICT DO NOTHING;
