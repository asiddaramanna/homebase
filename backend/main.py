from fastapi import FastAPI, Query
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


@app.get("/estimate")
def estimate_value(zip_code: str, sqft: int):
    sql = """
    SELECT
        COUNT(*) AS comp_count,
        ROUND(AVG(price), 2) AS avg_price,
        MIN(price) AS min_price,
        MAX(price) AS max_price,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY price) AS median_price,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY price) AS p25_price,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY price) AS p75_price
    FROM property_listing
    WHERE zip_code = %s
      AND status = 'sold'
      AND price IS NOT NULL
      AND house_size BETWEEN %s * 0.80 AND %s * 1.20
      AND prev_sold_date >= CURRENT_DATE - INTERVAL '18 months';
    """
    rows = run_query(sql, (zip_code, sqft, sqft))
    return rows[0] if rows else {}


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
