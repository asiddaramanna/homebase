import { useState } from 'react'
  const [form, setForm] = useState({
    state_code: 'CA',
    min_price: 500000,
    max_price: 1500000,
    min_beds: 3,
    min_baths: 2,
  })
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    const params = new URLSearchParams(form)
    const res = await fetch(`http://localhost:8000/search?${params.toString()}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Property Search</h1>
      <Link href="/">Home</Link>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem', maxWidth: '400px' }}>
        <input value={form.state_code} onChange={(e) => setForm({ ...form, state_code: e.target.value })} placeholder="State code" />
        <input type="number" value={form.min_price} onChange={(e) => setForm({ ...form, min_price: e.target.value })} placeholder="Min price" />
        <input type="number" value={form.max_price} onChange={(e) => setForm({ ...form, max_price: e.target.value })} placeholder="Max price" />
        <input type="number" value={form.min_beds} onChange={(e) => setForm({ ...form, min_beds: e.target.value })} placeholder="Min beds" />
        <input type="number" value={form.min_baths} onChange={(e) => setForm({ ...form, min_baths: e.target.value })} placeholder="Min baths" />
        <button onClick={handleSearch}>Search</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Listing ID</th>
            <th>ZIP</th>
            <th>City</th>
            <th>State</th>
            <th>Price</th>
            <th>Beds</th>
            <th>Baths</th>
            <th>House Size</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr key={row.listing_id}>
              <td>{row.listing_id}</td>
              <td>{row.zip_code}</td>
              <td>{row.city}</td>
              <td>{row.state}</td>
              <td>{row.price}</td>
              <td>{row.bed}</td>
              <td>{row.bath}</td>
              <td>{row.house_size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
