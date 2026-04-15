import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function TrendsPage() {
  const [zipCode, setZipCode] = useState('94103')
  const [propertyType, setPropertyType] = useState('All Residential')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://localhost:8000/trends?zip_code=${zipCode}&property_type=${encodeURIComponent(propertyType)}`)
    const data = await res.json()
    setResults(data)
  }

  const x = results.map((r) => r.period_begin)
  const salePrices = results.map((r) => r.median_sale_price)
  const listPrices = results.map((r) => r.median_list_price)

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Market Trends</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem', maxWidth: '400px' }}>
        <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP code" />
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option>All Residential</option>
          <option>Single Family</option>
          <option>Condo/Co-op</option>
          <option>Townhouse</option>
          <option>Multi-Family</option>
        </select>
        <button onClick={handleLoad}>Load Trends</button>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <Plot
            data={[
              { x, y: salePrices, type: 'scatter', mode: 'lines+markers', name: 'Median Sale Price' },
              { x, y: listPrices, type: 'scatter', mode: 'lines+markers', name: 'Median List Price' },
            ]}
            layout={{ width: 900, height: 500, title: `Price Trends for ${zipCode}` }}
          />
        </div>
      )}
    </div>
  )
}
