import { useState } from 'react'
import Link from 'next/link'

export default function HotMarketsPage() {
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch('http://127.0.0.1:8000/hot-markets')
    const data = await res.json()
    setResults(data)
  }

  const formatMoney = (value) => {
    if (value == null) return ''
    return `$${Number(value).toLocaleString()}`
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Hot Markets</h1>
        <p>Identify ZIP codes with the fastest-selling homes in the latest period.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Latest Market Snapshot</h2>
        <button
          onClick={handleLoad}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)',
          }}
        >
          Load Hot Markets
        </button>
      </section>

      <section className="sectionCard">
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Results</h2>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ZIP</th>
                <th>City</th>
                <th>State</th>
                <th>Latest Period</th>
                <th>Median DOM</th>
                <th>Median Sale Price</th>
                <th>Homes Sold</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.zip_code}</td>
                  <td>{row.city}</td>
                  <td>{row.state}</td>
                  <td>{row.latest_period}</td>
                  <td>{row.median_dom}</td>
                  <td>{formatMoney(row.median_sale_price)}</td>
                  <td>{row.homes_sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Load the latest hot-market rankings to view results.</p>
        )}
      </section>
    </div>
  )
}
