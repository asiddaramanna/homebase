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

# -----------------------
# SUMMARY
# -----------------------
@app.get("/summary")
def get_summary():
    sql = """
    SELECT
        status,
        COUNT(*) AS total_listings,
        ROUND(AVG(price), 2) AS avg_price
    FROM property_listing
    WHERE price IS NOT NULL
    GROUP BY status;
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
        pl.price,
        pl.bed,
        pl.bath
    FROM property_listing pl
    JOIN location l ON pl.zip_code = l.zip_code
    WHERE l.state_code = %s
      AND pl.status = 'for_sale'
      AND pl.price BETWEEN %s AND %s
      AND COALESCE(pl.bed, 0) >= %s
      AND COALESCE(pl.bath, 0) >= %s
    LIMIT 20;
    """
    return run_query(sql, (state_code, min_price, max_price, min_beds, min_baths))

# -----------------------
# ESTIMATE
# -----------------------
@app.get("/estimate")
def estimate_value(zip_code: str, sqft: int):
    sql = """
    SELECT
        COUNT(*) AS comp_count,
        ROUND(AVG(price), 2) AS avg_price
    FROM property_listing
    WHERE zip_code = %s
      AND status = 'sold'
      AND price IS NOT NULL
      AND house_size BETWEEN %s * 0.80 AND %s * 1.20;
    """
    rows = run_query(sql, (zip_code, sqft, sqft))
    return rows[0] if rows else {}

# -----------------------
# TRENDS
# -----------------------
@app.get("/trends")
def market_trends(zip_code: str):
    sql = """
    SELECT
        period_begin,
        median_sale_price,
        median_list_price
    FROM market_snapshot
    WHERE zip_code = %s
    ORDER BY period_begin;
    """
    return run_query(sql, (zip_code,))
