import { useState } from 'react'
import Link from 'next/link'

export default function EstimatePage() {
  const [zipCode, setZipCode] = useState('10001')
  const [sqft, setSqft] = useState(2000)
  const [result, setResult] = useState(null)

  const handleEstimate = async () => {
    const res = await fetch(`http://localhost:8000/estimate?zip_code=${zipCode}&sqft=${sqft}`)
    const data = await res.json()
    setResult(data)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Get Your Price</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem', maxWidth: '400px' }}>
        <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP code" />
        <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="Square feet" />
        <button onClick={handleEstimate}>Estimate</button>
      </div>

      {result && (
        <div style={{ marginTop: '1.5rem' }}>
          <p><strong>Comparable Sales:</strong> {result.comp_count}</p>
          <p><strong>Average Price:</strong> {result.avg_price}</p>
          <p><strong>Median Price:</strong> {result.median_price}</p>
          <p><strong>Min Price:</strong> {result.min_price}</p>
          <p><strong>Max Price:</strong> {result.max_price}</p>
          <p><strong>25th Percentile:</strong> {result.p25_price}</p>
          <p><strong>75th Percentile:</strong> {result.p75_price}</p>
        </div>
      )}
    </div>
  )
}
