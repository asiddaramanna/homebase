import { useState } from 'react'
import Link from 'next/link'

export default function AffordabilityPage() {
  const [stateCode, setStateCode] = useState('TX')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/affordability?state_code=${stateCode}`)
    setResults(await res.json())
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Affordability Explorer</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem' }}>
        <input value={stateCode} onChange={(e) => setStateCode(e.target.value)} placeholder="State code" />
        <button onClick={handleLoad}>Load Results</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
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
              <td>{row.avg_list_price}</td>
              <td>{row.median_list_price}</td>
              <td>{row.min_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
