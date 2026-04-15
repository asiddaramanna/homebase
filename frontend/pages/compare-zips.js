import { useState } from 'react'
import Link from 'next/link'

export default function CompareZipsPage() {
  const [zipCodes, setZipCodes] = useState('10001,90210,60601')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/compare-zips?zip_codes=${zipCodes}`)
    setResults(await res.json())
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>ZIP Code Comparison</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem' }}>
        <input
          value={zipCodes}
          onChange={(e) => setZipCodes(e.target.value)}
          placeholder="ZIPs separated by commas"
          style={{ width: '300px' }}
        />
        <button onClick={handleLoad}>Compare ZIPs</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
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
              <td>{row.median_sale_price}</td>
              <td>{row.median_list_price}</td>
              <td>{row.inventory}</td>
              <td>{row.median_dom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
