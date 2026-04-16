import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [summary, setSummary] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/summary')
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error(err))
  }, [])

  function formatStatus(status) {
  if (!status) return ''
  
  return status
    .split('_')
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
  }

  const totalListings = useMemo(() => {
    return summary.reduce((acc, row) => acc + Number(row.total_listings || 0), 0)
  }, [summary])

  const avgOfAverages = useMemo(() => {
    if (!summary.length) return null
    const vals = summary.map((row) => Number(row.avg_price || 0))
    return vals.reduce((a, b) => a + b, 0) / vals.length
  }, [summary])

  const formatNumber = (value) => {
    if (value == null) return ''
    return Number(value).toLocaleString()
  }

  const formatMoney = (value) => {
    if (value == null) return ''
    return `$${Number(value).toLocaleString()}`
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Home Base</h1>
        <p>
          A full-stack real estate analytics platform for home buyers, investors,
          and market researchers.
        </p>
      </section>

      <div className="navGrid">
        <Link href="/search" className="navCard">Property Search</Link>
        <Link href="/estimate" className="navCard">Get Your Price</Link>
        <Link href="/trends" className="navCard">Market Trends</Link>
        <Link href="/affordability" className="navCard">Affordability</Link>
        <Link href="/trends-by-type" className="navCard">Trends by Type</Link>
        <Link href="/hot-markets" className="navCard">Hot Markets</Link>
        <Link href="/compare-zips" className="navCard">Compare ZIPs</Link>
        <Link href="/yoy-appreciation" className="navCard">YoY Appreciation</Link>
        <Link href="/market-balance" className="navCard">Market Balance</Link>
      </div>

      <div className="statRow">
        <div className="statCard">
          <div className="statLabel">Statuses Covered</div>
          <div className="statValue">{summary.length}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Listings Summarized</div>
          <div className="statValue">{formatNumber(totalListings)}</div>
        </div>
        <div className="statCard">
          <div className="statLabel">Average of Status Averages</div>
          <div className="statValue">
            {avgOfAverages ? formatMoney(avgOfAverages.toFixed(0)) : ''}
          </div>
        </div>
      </div>

      <section className="sectionCard">
        <h2 className="sectionTitle">National Summary</h2>

        <div className="tableWrap">
          <table>
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
                  <td>{formatStatus(row.status)}</td>
                  <td>{formatNumber(row.total_listings)}</td>
                  <td>{formatMoney(row.avg_price)}</td>
                  <td>{formatMoney(row.median_price)}</td>
                  <td>{formatMoney(row.min_price)}</td>
                  <td>{formatMoney(row.max_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
