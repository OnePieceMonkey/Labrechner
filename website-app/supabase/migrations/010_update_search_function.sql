-- ################################################
-- Migration 010: Update search_bel_positions with Offset and Default Listing
-- ################################################

CREATE OR REPLACE FUNCTION search_bel_positions(
  search_query TEXT DEFAULT '',
  user_kzv_id INTEGER DEFAULT NULL,
  user_labor_type VARCHAR DEFAULT 'gewerbe',
  group_filter INTEGER DEFAULT NULL,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id INTEGER,
  position_code VARCHAR,
  name VARCHAR,
  description TEXT,
  group_id INTEGER,
  group_name VARCHAR,
  price DECIMAL,
  is_ukps BOOLEAN,
  is_implant BOOLEAN,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bp.id,
    bp.position_code,
    bp.name,
    bp.description,
    bp.group_id,
    bg.name AS group_name,
    pr.price,
    bp.is_ukps,
    bp.is_implant,
    CASE 
      WHEN search_query = '' OR search_query IS NULL THEN 1.0 -- Default rank for empty search
      ELSE 
        GREATEST(
          ts_rank(to_tsvector('german', bp.name || ' ' || COALESCE(bp.description, '')), plainto_tsquery('german', search_query)),
          similarity(bp.name, search_query),
          CASE WHEN bp.position_code ILIKE search_query || '%' THEN 1.0 ELSE 0.0 END
        )::REAL 
    END AS rank
  FROM bel_positions bp
  LEFT JOIN bel_groups bg ON bp.group_id = bg.id
  LEFT JOIN bel_prices pr ON bp.id = pr.position_id
    AND (user_kzv_id IS NULL OR pr.kzv_id = user_kzv_id)
    AND pr.labor_type = user_labor_type
    AND pr.valid_from <= CURRENT_DATE
    AND (pr.valid_until IS NULL OR pr.valid_until >= CURRENT_DATE)
  WHERE
    (
      search_query = '' OR search_query IS NULL
      OR to_tsvector('german', bp.name || ' ' || COALESCE(bp.description, '')) @@ plainto_tsquery('german', search_query)
      OR similarity(bp.name, search_query) > 0.3
      OR bp.position_code ILIKE search_query || '%'
      OR bp.name ILIKE '%' || search_query || '%'
    )
    AND (group_filter IS NULL OR bp.group_id = group_filter)
  ORDER BY 
    CASE WHEN search_query = '' OR search_query IS NULL THEN 0 ELSE 1 END, -- Put default list first
    rank DESC, 
    bp.position_code ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;
