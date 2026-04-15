import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function TrendsByTypePage() {
  const [zipCode, setZipCode] = useState('10001')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/trends-by-type?zip_code=${zipCode}`)
    setResults(await res.json())
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
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Market Trends by Property Type</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem' }}>
        <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP code" />
        <button onClick={handleLoad}>Load Results</button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <Plot
            data={traces}
            layout={{ width: 950, height: 520, title: `Median Sale Price by Property Type for ${zipCode}` }}
          />
        </div>
      )}
    </div>
  )
}
