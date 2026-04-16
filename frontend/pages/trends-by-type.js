import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function TrendsByTypePage() {
  const [zipCode, setZipCode] = useState('10001')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/trends-by-type?zip_code=${zipCode}`)
    const data = await res.json()
    setResults(data)
  }

  const types = ['Single Family', 'Condo/Co-op', 'Townhouse', 'Multi-Family']

  const traces = types.map((type) => {
    const filtered = results.filter((r) => r.property_type === type)
    return {
      x: filtered.map((r) => r.period_begin),
      y: filtered.map((r) => r.median_sale_price),
      type: 'scatter',
      mode: 'lines+markers',
      name: type,
    }
  })

  return (
    <div className="page">
      <section className="hero">
        <h1>Trends by Property Type</h1>
        <p>Compare price movements across Single Family, Condo/Co-op, Townhouse, and Multi-Family homes.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>ZIP Selection</h2>

        <div style={{ maxWidth: '240px' }}>
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
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Visualization</h2>

        {results.length > 0 ? (
          <Plot
            data={traces}
            layout={{
              width: 1050,
              height: 540,
              title: `Median Sale Price by Property Type for ${zipCode}`,
              paper_bgcolor: '#ffffff',
              plot_bgcolor: '#ffffff',
            }}
          />
        ) : (
          <p style={{ color: '#6b7280' }}>Load results to compare property-type trends.</p>
        )}
      </section>
    </div>
  )
}
