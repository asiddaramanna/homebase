import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function YoyAppreciationPage() {
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch('http://127.0.0.1:8000/yoy-appreciation')
    setResults(await res.json())
  }

  const x = results.map((r) => r.state_code)
  const y = results.map((r) => r.yoy_pct_change)

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Year-over-Year Appreciation by State</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleLoad}>Load YoY Appreciation</button>
      </div>

      {results.length > 0 && (
        <>
          <div style={{ marginTop: '1rem' }}>
            <Plot
              data={[{ x, y, type: 'bar', name: 'YoY % Change' }]}
              layout={{ width: 1000, height: 500, title: 'YoY Price Appreciation by State' }}
            />
          </div>

          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
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
                  <td>{row.current_avg_price}</td>
                  <td>{row.prior_avg_price}</td>
                  <td>{row.yoy_pct_change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
