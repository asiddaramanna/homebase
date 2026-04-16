import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function TrendsPage() {
  const [zipCode, setZipCode] = useState('94103')
  const [propertyType, setPropertyType] = useState('All Residential')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/trends?zip_code=${zipCode}&property_type=${encodeURIComponent(propertyType)}`)
    const data = await res.json()
    setResults(data)
  }

  const x = results.map((r) => r.period_begin)
  const sale = results.map((r) => r.median_sale_price)
  const list = results.map((r) => r.median_list_price)

  return (
    <div className="page">
      <section className="hero">
        <h1>Market Trends</h1>
        <p>Track median sale price and list price over time for a selected ZIP code and property type.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Trend Filters</h2>

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
              placeholder="94103"
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                background: 'white',
              }}
            >
              <option>All Residential</option>
              <option>Single Family</option>
              <option>Condo/Co-op</option>
              <option>Townhouse</option>
              <option>Multi-Family</option>
            </select>
          </div>
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
            Load Trends
          </button>
        </div>
      </section>

      <section className="sectionCard">
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Trend Visualization</h2>

        {results.length > 0 ? (
          <div style={{ marginTop: '8px' }}>
            <Plot
              data={[
                { x, y: sale, type: 'scatter', mode: 'lines+markers', name: 'Median Sale Price' },
                { x, y: list, type: 'scatter', mode: 'lines+markers', name: 'Median List Price' },
              ]}
              layout={{
                width: 1000,
                height: 520,
                title: `Price Trends for ${zipCode} (${propertyType})`,
                paper_bgcolor: '#ffffff',
                plot_bgcolor: '#ffffff',
              }}
            />
          </div>
        ) : (
          <p style={{ color: '#6b7280' }}>Load trend data to view the chart.</p>
        )}
      </section>
    </div>
  )
}
