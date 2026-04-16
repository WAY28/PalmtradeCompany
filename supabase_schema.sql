-- ============================================================
-- PT PALM TRADE COMPANY - Supabase Schema
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  market        TEXT NOT NULL,
  weight_range  TEXT NOT NULL,
  husk_type     TEXT DEFAULT 'Semi Husked',
  condition     TEXT,
  packaging     TEXT DEFAULT 'Nett Bag (export packing)',
  capacity      TEXT DEFAULT '± 2,800 Tons per Month',
  price         TEXT DEFAULT 'Negotiable with buyers',
  contact       TEXT DEFAULT '082293807717',
  quality       TEXT,
  color         TEXT,
  documents     TEXT[],
  image_url     TEXT,
  is_active     BOOLEAN DEFAULT true,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id      TEXT NOT NULL,
  title_en      TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  excerpt_id    TEXT,
  excerpt_en    TEXT,
  content_id    TEXT,
  content_en    TEXT,
  image_url     TEXT,
  is_published  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE gallery (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url     TEXT NOT NULL,
  caption_id    TEXT,
  caption_en    TEXT,
  category      TEXT DEFAULT 'product',
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE team (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  role_id       TEXT NOT NULL,
  role_en       TEXT NOT NULL,
  photo_url     TEXT,
  social_url    TEXT,
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contacts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  country       TEXT,
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery   ENABLE ROW LEVEL SECURITY;
ALTER TABLE team      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts  ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read posts"    ON posts    FOR SELECT USING (is_published = true);
CREATE POLICY "Public read gallery"  ON gallery  FOR SELECT USING (true);
CREATE POLICY "Public read team"     ON team     FOR SELECT USING (is_active = true);

-- Admin full access (service role key bypasses RLS, so these are for anon role in admin)
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Service role can do everything (used in admin API routes)
CREATE POLICY "Service full products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full posts"    ON posts    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full gallery"  ON gallery  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full team"     ON team     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('palmtrade-images', 'palmtrade-images', true);
CREATE POLICY "Public read images"  ON storage.objects FOR SELECT USING (bucket_id = 'palmtrade-images');
CREATE POLICY "Auth upload images"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'palmtrade-images');
CREATE POLICY "Auth delete images"  ON storage.objects FOR DELETE USING (bucket_id = 'palmtrade-images');

-- Sample data
INSERT INTO products (market, weight_range, quality, color, husk_type, condition, packaging, capacity, price, contact, documents, sort_order) VALUES
('Thailand', '0.8 – 1.2 Kg per coconut', 'Export Premium (Thailand Standard)', 'Natural Brown Shell', 'Semi Husked', 'Export ready', 'Nett Bag (export packing)', '± 2,800 Tons per Month', 'Negotiable with buyers', '082293807717', ARRAY['Phytosanitary Certificate','Certificate of Origin (Form E – ACFTA)','Commercial Invoice','Packing List','Bill of Lading (B/L)'], 1),
('China', '1.0 – 1.4 Kg per coconut', NULL, NULL, 'Semi Husked', 'Non-germinated, clean shell, export ready', 'Nett Bag (export packing)', '± 2,800 Tons per Month', 'Negotiable with buyers', '082293807717', ARRAY['GACC Registration (China Customs)','Phytosanitary Certificate','Certificate of Origin (Form E – ACFTA)','Commercial Invoice & Packing List','Bill of Lading (B/L)','Export Declaration (PEB Indonesia)'], 2),
('India', '0.9 – 1.3 Kg per coconut', NULL, NULL, 'Semi Husked', 'Non-germinated, clean shell, export ready', 'Nett Bag (export packing)', '± 2,800 Tons per Month', 'Negotiable with buyers', '082293807717', ARRAY['Phytosanitary Certificate','Certificate of Origin (COO)','Commercial Invoice','Packing List','Bill of Lading (B/L)'], 3);

INSERT INTO team (name, role_id, role_en, sort_order) VALUES
('Ari Sadhu', 'Marketing', 'Marketing', 1),
('Ayu Sintyawati', 'Marketing', 'Marketing', 2);

SELECT 'Schema created successfully!' as status;
