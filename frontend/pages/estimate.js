import { useState } from 'react'
import Link from 'next/link'

export default function EstimatePage() {
  const [zipCode, setZipCode] = useState('10001')
  const [sqft, setSqft] = useState(2000)
  const [result, setResult] = useState(null)

  const handleEstimate = async () => {
    const res = await fetch(`http://127.0.0.1:8000/estimate?zip_code=${zipCode}&sqft=${sqft}`)
    const data = await res.json()
    setResult(data)
  }

  const formatMoney = (value) => {
    if (value == null || value === '') return ''
    return `$${Number(value).toLocaleString()}`
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Get Your Price</h1>
        <p>Estimate a home value using recent comparable sales in the same ZIP code.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Estimator Inputs</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>ZIP Code</label>
            <input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="10001"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Square Footage</label>
            <input
              type="number"
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              placeholder="2000"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleEstimate}
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
            Estimate Price
          </button>
        </div>
      </section>

      <section className="sectionCard">
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Estimate Results</h2>

        {result ? (
          <>
            <div className="statRow">
              <div className="statCard">
                <div className="statLabel">Comparable Sales</div>
                <div className="statValue">{result.comp_count ?? 0}</div>
              </div>
              <div className="statCard">
                <div className="statLabel">Average Price</div>
                <div className="statValue">{formatMoney(result.avg_price)}</div>
              </div>
              <div className="statCard">
                <div className="statLabel">Median Price</div>
                <div className="statValue">{formatMoney(result.median_price)}</div>
              </div>
            </div>

            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Min Price</th>
                    <th>25th Percentile</th>
                    <th>Median Price</th>
                    <th>75th Percentile</th>
                    <th>Max Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formatMoney(result.min_price)}</td>
                    <td>{formatMoney(result.p25_price)}</td>
                    <td>{formatMoney(result.median_price)}</td>
                    <td>{formatMoney(result.p75_price)}</td>
                    <td>{formatMoney(result.max_price)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p style={{ color: '#6b7280' }}>Run the estimator to view comparable-sale metrics.</p>
        )}
      </section>
    </div>
  )
}
