from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "homebase.c4lebab1ydn7.us-east-1.rds.amazonaws.com",
    "port": 5432,
    "dbname": "homebase",
    "user": "guest",
    "password": "CIS5500guest2026",
    "sslmode": "require",
}

def run_query(sql, params=None):
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or ())
            return cur.fetchall()
    finally:
        conn.close()

@app.get("/")
def root():
    return {"message": "HomeBase API running"}

# Query 5 — reads from mv_national_summary (precomputed aggregate over ~2.2M listings)
@app.get("/summary")
def get_summary():
    sql = """
    SELECT
        status,
        count AS total_listings,
        ROUND(median_price::numeric, 2) AS median_price,
        ROUND(avg_bed, 1) AS avg_beds,
        ROUND(avg_bath, 1) AS avg_baths,
        ROUND(avg_sqft, 0) AS avg_sqft
    FROM mv_national_summary
    ORDER BY count DESC;
    """
    return run_query(sql)

# Query 1
@app.get("/search")
def property_search(
    state_code: str,
    min_price: int,
    max_price: int,
    min_beds: int = 0,
    min_baths: int = 0,
    limit: int = 20,
    offset: int = 0,
):
    sql = """
    SELECT
        pl.listing_id,
        pl.zip_code,
        l.city,
        l.state,
        pl.status,
        pl.price,
        pl.bed,
        pl.bath,
        pl.house_size,
        pl.acre_lot
    FROM property_listing pl
    JOIN location l ON pl.zip_code = l.zip_code
    WHERE l.state_code = %s
      AND pl.status = 'for_sale'
      AND pl.price BETWEEN %s AND %s
      AND COALESCE(pl.bed, 0) >= %s
      AND COALESCE(pl.bath, 0) >= %s
    ORDER BY pl.price ASC
    LIMIT %s OFFSET %s;
    """
    return run_query(sql, (state_code, min_price, max_price, min_beds, min_baths, limit, offset))

# Query 2
@app.get("/estimate")
def estimate_value(zip_code: str, sqft: int):
    sql = sql = """
    SELECT
        COUNT(*) AS comp_count,
        ROUND(AVG(price), 2) AS avg_price,
        MIN(price) AS min_price,
        MAX(price) AS max_price,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY price) AS p25_price,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY price) AS median_price,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY price) AS p75_price
    FROM property_listing
    WHERE zip_code = %s
      AND status = 'sold'
      AND price IS NOT NULL
      AND (
            house_size IS NULL
            OR house_size BETWEEN %s * 0.60 AND %s * 1.40
          );
    """
    rows = run_query(sql, (zip_code, sqft, sqft))
    return rows[0] if rows else {}

# Query 3
@app.get("/trends")
def market_trends(zip_code: str, property_type: str = "All Residential"):
    sql = """
    SELECT
        ms.period_begin,
        ms.period_end,
        ms.median_sale_price,
        ms.median_list_price,
        ms.median_ppsf,
        ms.median_dom,
        ms.inventory,
        ms.homes_sold,
        ms.avg_sale_to_list
    FROM market_snapshot ms
    JOIN property_type_mapping ptm ON ms.type_id = ptm.type_id
    WHERE ms.zip_code = %s
      AND ptm.standardized_label = %s
    ORDER BY ms.period_begin ASC;
    """
    return run_query(sql, (zip_code, property_type))

# Query 4
@app.get("/affordability")
def affordability(state_code: str):
    sql = """
    SELECT
        pl.zip_code,
        l.city,
        l.state,
        COUNT(*) AS active_listings,
        ROUND(AVG(pl.price), 2) AS avg_list_price,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY pl.price) AS median_list_price,
        MIN(pl.price) AS min_price
    FROM property_listing pl
    JOIN location l ON pl.zip_code = l.zip_code
    WHERE l.state_code = %s
      AND pl.status = 'for_sale'
      AND pl.price IS NOT NULL
    GROUP BY pl.zip_code, l.city, l.state
    HAVING COUNT(*) >= 5
    ORDER BY median_list_price ASC
    LIMIT 25;
    """
    return run_query(sql, (state_code,))

# Query 6
@app.get("/trends-by-type")
def trends_by_type(zip_code: str):
    sql = """
    SELECT
        ms.period_begin,
        ptm.standardized_label AS property_type,
        ms.median_sale_price,
        ms.median_list_price,
        ms.homes_sold,
        ms.median_dom
    FROM market_snapshot ms
    JOIN property_type_mapping ptm ON ms.type_id = ptm.type_id
    WHERE ms.zip_code = %s
      AND ptm.standardized_label IN (
        'Single Family',
        'Condo/Co-op',
        'Townhouse',
        'Multi-Family'
      )
      AND ms.median_sale_price IS NOT NULL
    ORDER BY ms.period_begin ASC, ptm.standardized_label ASC;
    """
    return run_query(sql, (zip_code,))

# Query 7
@app.get("/hot-markets")
def hot_markets():
    sql = """
    SELECT
        ms.zip_code,
        l.city,
        l.state,
        ms.period_begin AS latest_period,
        ms.median_dom,
        ms.median_sale_price,
        ms.homes_sold,
        ms.sold_above_list,
        ms.off_market_in_two_weeks
    FROM market_snapshot ms
    JOIN location l ON ms.zip_code = l.zip_code
    JOIN property_type_mapping ptm ON ms.type_id = ptm.type_id
    WHERE ptm.standardized_label = 'All Residential'
      AND ms.period_begin = (
        SELECT MAX(period_begin) FROM market_snapshot
      )
      AND ms.median_dom IS NOT NULL
      AND ms.homes_sold > 0
    ORDER BY ms.median_dom ASC, ms.homes_sold DESC
    LIMIT 20;
    """
    return run_query(sql)

# Query 8
@app.get("/compare-zips")
def compare_zips(zip_codes: str):
    zip_list = [z.strip() for z in zip_codes.split(",") if z.strip()]
    if not zip_list:
        return []

    placeholders = ",".join(["%s"] * len(zip_list))

    sql = f"""
    SELECT
        ms.zip_code,
        l.city,
        l.state,
        ms.period_begin,
        ms.median_sale_price,
        ms.median_list_price,
        ms.median_ppsf,
        ms.inventory,
        ms.median_dom,
        ms.avg_sale_to_list,
        ms.sold_above_list
    FROM market_snapshot ms
    JOIN location l ON ms.zip_code = l.zip_code
    JOIN property_type_mapping ptm ON ms.type_id = ptm.type_id
    WHERE ms.zip_code IN ({placeholders})
      AND ptm.standardized_label = 'All Residential'
      AND ms.period_begin = (
        SELECT MAX(period_begin)
        FROM market_snapshot ms2
        WHERE ms2.zip_code = ms.zip_code
          AND ms2.type_id = ms.type_id
      )
    ORDER BY ms.median_sale_price ASC;
    """
    return run_query(sql, tuple(zip_list))

# Query 9
@app.get("/yoy-appreciation")
def yoy_appreciation():
    sql = """
    WITH annual_state_prices AS (
        SELECT
            l.state_code,
            l.state,
            EXTRACT(YEAR FROM ms.period_begin)::INT AS price_year,
            ROUND(AVG(ms.median_sale_price), 2) AS avg_median_price
        FROM market_snapshot ms
        JOIN location l ON ms.zip_code = l.zip_code
        JOIN property_type_mapping ptm ON ms.type_id = ptm.type_id
        WHERE ptm.standardized_label = 'All Residential'
          AND ms.median_sale_price IS NOT NULL
        GROUP BY l.state_code, l.state, price_year
    )
    SELECT
        curr.state_code,
        curr.state,
        curr.price_year AS current_year,
        curr.avg_median_price AS current_avg_price,
        prev.avg_median_price AS prior_avg_price,
        ROUND(
            (curr.avg_median_price - prev.avg_median_price)
            / NULLIF(prev.avg_median_price, 0) * 100,
            2
        ) AS yoy_pct_change
    FROM annual_state_prices curr
    JOIN annual_state_prices prev
      ON curr.state_code = prev.state_code
     AND curr.price_year = prev.price_year + 1
    WHERE curr.price_year = (
        SELECT MAX(price_year) FROM annual_state_prices
    )
    ORDER BY yoy_pct_change DESC;
    """
    return run_query(sql)

# Query 10
@app.get("/market-balance")
def market_balance(state_code: str):
    sql = """
    SELECT
        ms.zip_code,
        l.city,
        l.state,
        ms.median_sale_price,
        ms.median_list_price,
        ms.inventory,
        ms.pending_sales,
        ROUND(
            ms.pending_sales::DECIMAL / NULLIF(ms.inventory, 0),
            3
        ) AS demand_ratio,
        CASE
            WHEN ms.pending_sales::DECIMAL / NULLIF(ms.inventory, 0) > 0.5
                THEN 'Seller''s Market'
            WHEN ms.pending_sales::DECIMAL / NULLIF(ms.inventory, 0) < 0.2
                THEN 'Buyer''s Market'
            ELSE 'Balanced Market'
        END AS market_type,
        ROUND(
            (ms.median_sale_price - ms.median_list_price)
            / NULLIF(ms.median_list_price, 0) * 100,
            2
        ) AS sale_vs_list_pct
    FROM market_snapshot ms
    JOIN location l ON ms.zip_code = l.zip_code
    JOIN property_type_mapping ptm ON ms.type_id = ptm.type_id
    WHERE ptm.standardized_label = 'All Residential'
      AND ms.period_begin = (SELECT MAX(period_begin) FROM market_snapshot)
      AND l.state_code = %s
      AND ms.inventory IS NOT NULL
      AND ms.pending_sales IS NOT NULL
    ORDER BY demand_ratio DESC;
    """
    return run_query(sql, (state_code,))
