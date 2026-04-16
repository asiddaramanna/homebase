import { useState } from 'react'
import Link from 'next/link'

export default function SearchPage() {
  const [form, setForm] = useState({
    state_code: 'CA',
    min_price: 500000,
    max_price: 1500000,
    min_beds: 3,
    min_baths: 2,
  })
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    const params = new URLSearchParams({
      state_code: form.state_code,
      min_price: String(form.min_price),
      max_price: String(form.max_price),
      min_beds: String(form.min_beds),
      min_baths: String(form.min_baths),
    })

    const res = await fetch(`http://127.0.0.1:8000/search?${params.toString()}`)
    const data = await res.json()
    setResults(data)
  }

  const formatMoney = (value) => {
    if (value == null) return ''
    return `$${Number(value).toLocaleString()}`
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Property Search</h1>
        <p>Search active listings by state, price range, beds, and baths.</p>
      </section>

      <div style={{ marginBottom: '20px' }}>
        <Link href="/" className="navCard">← Back to Home</Link>
      </div>

      <section className="sectionCard" style={{ marginBottom: '24px' }}>
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>Search Filters</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>State Code</label>
            <input
              value={form.state_code}
              onChange={(e) => setForm({ ...form, state_code: e.target.value.toUpperCase() })}
              placeholder="CA"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Min Price</label>
            <input
              type="number"
              value={form.min_price}
              onChange={(e) => setForm({ ...form, min_price: e.target.value })}
              placeholder="500000"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Max Price</label>
            <input
              type="number"
              value={form.max_price}
              onChange={(e) => setForm({ ...form, max_price: e.target.value })}
              placeholder="1500000"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Min Beds</label>
            <input
              type="number"
              value={form.min_beds}
              onChange={(e) => setForm({ ...form, min_beds: e.target.value })}
              placeholder="3"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Min Baths</label>
            <input
              type="number"
              value={form.min_baths}
              onChange={(e) => setForm({ ...form, min_baths: e.target.value })}
              placeholder="2"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleSearch}
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
            Search Listings
          </button>
        </div>
      </section>

      <section className="sectionCard">
        <h2 className="sectionTitle" style={{ fontSize: '28px' }}>
          Results {results.length > 0 ? `(${results.length})` : ''}
        </h2>

        <div className="tableWrap">
          <table>
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
                  <td>{formatMoney(row.price)}</td>
                  <td>{row.bed}</td>
                  <td>{row.bath}</td>
                  <td>{row.house_size != null ? Number(row.house_size).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <p style={{ marginTop: '16px', color: '#6b7280' }}>
            Run a search to view matching listings.
          </p>
        )}
      </section>
    </div>
  )
}
