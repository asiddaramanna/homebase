from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras

app = FastAPI()

# Allow frontend (Next.js) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
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


# -----------------------
# SUMMARY
# -----------------------
@app.get("/summary")
def get_summary():
    sql = """
    SELECT
        status,
        COUNT(*) AS total_listings,
        ROUND(AVG(price), 2) AS avg_price,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY price) AS median_price,
        MIN(price) AS min_price,
        MAX(price) AS max_price
    FROM property_listing
    WHERE price IS NOT NULL
    GROUP BY status
    ORDER BY total_listings DESC;
    """
    return run_query(sql)


# -----------------------
# PROPERTY SEARCH
# -----------------------
@app.get("/search")
def property_search(
    state_code: str,
    min_price: int,
    max_price: int,
    min_beds: int = 0,
    min_baths: int = 0,
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
    LIMIT 20;
    """
    return run_query(sql, (state_code, min_price, max_price, min_beds, min_baths))


# -----------------------
# GET YOUR PRICE
# -----------------------
@app.get("/estimate")
def estimate_value(zip_code: str, sqft: int):
    sql = """
    SELECT
        COUNT(*) AS comp_count,
        ROUND(AVG(price), 2) AS avg_price,
        MIN(price) AS min_price,
        MAX(price) AS max_price,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY price) AS median_price
    FROM property_listing
    WHERE zip_code = %s
      AND status = 'sold'
      AND price IS NOT NULL
      AND house_size BETWEEN %s * 0.80 AND %s * 1.20
      AND prev_sold_date >= CURRENT_DATE - INTERVAL '18 months';
    """
    rows = run_query(sql, (zip_code, sqft, sqft))
    return rows[0] if rows else {}


# -----------------------
# MARKET TRENDS
# -----------------------
@app.get("/trends")
def market_trends(zip_code: str):
    sql = """
    SELECT
        period_begin,
        median_sale_price,
        median_list_price,
        inventory,
        homes_sold
    FROM market_snapshot
    WHERE zip_code = %s
    ORDER BY period_begin ASC;
    """
    return run_query(sql, (zip_code,))
