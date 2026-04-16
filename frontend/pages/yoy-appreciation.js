import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function YoyAppreciationPage() {
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch('http://127.0.0.1:8000/yoy-appreciation')
    const data = await res.json()
    setResults(data)
  }

  const x = results.map((r) => r.state_code)
  const y = results.map((r) => r.yoy_pct_change)

  const formatMoney = (value) => {
    if (value == null) return ''
    return `$${Number(value).toLocaleString()}`
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Year-over-Year Appreciation</h1>
        <p>Measure state-level home price growth by comparing annual average median prices.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>State Growth Analysis</h2>
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
          Load YoY Appreciation
        </button>
      </section>

      <section className="sectionCard">
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Visualization</h2>

        {results.length > 0 ? (
          <>
            <Plot
              data={[{ x, y, type: 'bar', name: 'YoY % Change' }]}
              layout={{
                width: 1050,
                height: 520,
                title: 'YoY Price Appreciation by State',
                paper_bgcolor: '#ffffff',
                plot_bgcolor: '#ffffff',
              }}
            />

            <div className="tableWrap" style={{ marginTop: '16px' }}>
              <table>
                <thead>
                  <tr>
                    <th>State Code</th>
                    <th>State</th>
                    <th>Current Year</th>
                    <th>Current Avg Price</th>
                    <th>Prior Avg Price</th>
                    <th>YoY % Change</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.state_code}</td>
                      <td>{row.state}</td>
                      <td>{row.current_year}</td>
                      <td>{formatMoney(row.current_avg_price)}</td>
                      <td>{formatMoney(row.prior_avg_price)}</td>
                      <td>{row.yoy_pct_change}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p style={{ color: '#6b7280' }}>Load the analysis to view appreciation trends.</p>
        )}
      </section>
    </div>
  )
}
