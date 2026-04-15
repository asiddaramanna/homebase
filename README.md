# homebase
Full-stack real estate analytics web app using PostgreSQL, FastAPI, Next.js, and Plotly

Team

Kesigan Sribaskararajah
Anusha Siddaramanna
Connor Ryan

Tech Stack:
  PostgreSQL – database for real estate listings and market data
  FastAPI – backend API for executing SQL queries
  Next.js (React) – frontend user interface
  Plotly – data visualization for market trends

Features
  Property Search
    Search listings by state, price range, bedrooms, and bathrooms
  Market Trends
    Visualize changes in home prices and inventory over time
  Home Value Estimator
    Estimate property value using comparable recent sales
  Affordability Explorer
    Identify the most affordable zip codes within a state

Database
  The application integrates:
  Realtor.com listing data (about 2.2M records)
  Redfin market data (about 9.5M records across 24,000+ zip codes)

How to Run
Backend
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload
Frontend
  cd frontend
  npm install
  npm run dev
Then open the following to see the frontend and backend
  Frontend → http://localhost:3000
  Backend docs → http://localhost:8000/docs

Testing
SQL-based validation tests were implemented to ensure correctness of:
  filtering conditions
  aggregation logic
  ordering and temporal constraints
  edge cases such as NULL values and divide-by-zero

All tests returned 0 invalid rows (except test 2 which is not supposed to return 0), confirming query correctness.
