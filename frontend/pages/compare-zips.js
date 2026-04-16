import { useState } from 'react'
import Link from 'next/link'

export default function CompareZipsPage() {
  const [zipCodes, setZipCodes] = useState('10001,90210,60601')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/compare-zips?zip_codes=${zipCodes}`)
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
        <h1>ZIP Code Comparison</h1>
        <p>Compare the latest market snapshot across multiple ZIP codes side by side.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Compare Inputs</h2>

        <div style={{ maxWidth: '380px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>ZIP Codes (comma-separated)</label>
          <input
            value={zipCodes}
            onChange={(e) => setZipCodes(e.target.value)}
            placeholder="10001,90210,60601"
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
            Compare ZIPs
          </button>
        </div>
      </section>

      <section className="sectionCard">
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Comparison Results</h2>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ZIP</th>
                <th>City</th>
                <th>State</th>
                <th>Period</th>
                <th>Median Sale Price</th>
                <th>Median List Price</th>
                <th>Inventory</th>
                <th>Median DOM</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.zip_code}</td>
                  <td>{row.city}</td>
                  <td>{row.state}</td>
                  <td>{row.period_begin}</td>
                  <td>{formatMoney(row.median_sale_price)}</td>
                  <td>{formatMoney(row.median_list_price)}</td>
                  <td>{row.inventory}</td>
                  <td>{row.median_dom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Enter ZIP codes and compare their latest market metrics.</p>
        )}
      </section>
    </div>
  )
}
