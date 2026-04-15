import { useState } from 'react'
import Link from 'next/link'

export default function MarketBalancePage() {
  const [stateCode, setStateCode] = useState('WA')
  const [results, setResults] = useState([])

  const handleLoad = async () => {
    const res = await fetch(`http://127.0.0.1:8000/market-balance?state_code=${stateCode}`)
    setResults(await res.json())
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Inventory vs Demand</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem' }}>
        <input value={stateCode} onChange={(e) => setStateCode(e.target.value)} placeholder="State code" />
        <button onClick={handleLoad}>Load Market Balance</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ZIP</th>
            <th>City</th>
            <th>State</th>
            <th>Median Sale Price</th>
            <th>Median List Price</th>
            <th>Inventory</th>
            <th>Pending Sales</th>
            <th>Demand Ratio</th>
            <th>Market Type</th>
            <th>Sale vs List %</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, idx) => (
            <tr key={idx}>
              <td>{row.zip_code}</td>
              <td>{row.city}</td>
              <td>{row.state}</td>
              <td>{row.median_sale_price}</td>
              <td>{row.median_list_price}</td>
              <td>{row.inventory}</td>
              <td>{row.pending_sales}</td>
              <td>{row.demand_ratio}</td>
              <td>{row.market_type}</td>
              <td>{row.sale_vs_list_pct}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
