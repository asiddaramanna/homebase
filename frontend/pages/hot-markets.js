import { useState } from 'react'
import Link from 'next/link'

export default function HotMarketsPage() {
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch('http://127.0.0.1:8000/hot-markets')
    setResults(await res.json())
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Hot Markets</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleLoad}>Load Hot Markets</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ZIP</th>
            <th>City</th>
            <th>State</th>
            <th>Latest Period</th>
            <th>Median DOM</th>
            <th>Median Sale Price</th>
            <th>Homes Sold</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, idx) => (
            <tr key={idx}>
              <td>{row.zip_code}</td>
              <td>{row.city}</td>
              <td>{row.state}</td>
              <td>{row.latest_period}</td>
              <td>{row.median_dom}</td>
              <td>{row.median_sale_price}</td>
              <td>{row.homes_sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
