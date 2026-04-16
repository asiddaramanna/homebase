import { useState } from 'react'
import Link from 'next/link'

export default function AffordabilityPage() {
  const [stateCode, setStateCode] = useState('TX')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/affordability?state_code=${stateCode}`)
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
        <h1>Affordability Explorer</h1>
        <p>Find the most affordable ZIP codes in a state based on median listing price.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Filter</h2>

        <div style={{ maxWidth: '240px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>State Code</label>
          <input
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value.toUpperCase())}
            placeholder="TX"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '15px',
            }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
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
            Load Results
          </button>
        </div>
      </section>

      <section className="sectionCard">
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Affordable ZIP Codes</h2>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ZIP</th>
                <th>City</th>
                <th>State</th>
                <th>Active Listings</th>
                <th>Avg List Price</th>
                <th>Median List Price</th>
                <th>Min Price</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.zip_code}</td>
                  <td>{row.city}</td>
                  <td>{row.state}</td>
                  <td>{row.active_listings}</td>
                  <td>{formatMoney(row.avg_list_price)}</td>
                  <td>{formatMoney(row.median_list_price)}</td>
                  <td>{formatMoney(row.min_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Load results to view affordable ZIP codes.</p>
        )}
      </section>
    </div>
  )
}
