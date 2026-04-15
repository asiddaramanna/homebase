import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [summary, setSummary] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/summary')
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>HomeBase</h1>
      <p>Real estate analytics web app for home buyers and market research.</p>

      <nav style={{ marginBottom: '1.5rem' }}>
        <Link href="/search">Property Search</Link> {' | '}
        <Link href="/estimate">Get Your Price</Link> {' | '}
        <Link href="/trends">Market Trends</Link> {' | '}
        <Link href="/affordability">Affordability</Link> {' | '}
        <Link href="/trends-by-type">Trends by Type</Link> {' | '}
        <Link href="/hot-markets">Hot Markets</Link> {' | '}
        <Link href="/compare-zips">Compare ZIPs</Link> {' | '}
        <Link href="/yoy-appreciation">YoY Appreciation</Link> {' | '}
        <Link href="/market-balance">Market Balance</Link>
      </nav>

      <h2>National Summary</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Total Listings</th>
            <th>Avg Price</th>
            <th>Median Price</th>
            <th>Min Price</th>
            <th>Max Price</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row, idx) => (
            <tr key={idx}>
              <td>{row.status}</td>
              <td>{row.total_listings}</td>
              <td>{row.avg_price}</td>
              <td>{row.median_price}</td>
              <td>{row.min_price}</td>
              <td>{row.max_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
