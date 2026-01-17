import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../../api/sheets'

function PoliticianList() {
  const [politicians, setPoliticians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterParty, setFilterParty] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()
      setPoliticians(data.politicians)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const parties = [...new Set(politicians.map(p => p.party).filter(Boolean))].sort()
  const levels = [...new Set(politicians.map(p => p.office_level).filter(Boolean))].sort()

  const filteredPoliticians = politicians.filter(p => {
    const matchesSearch = !searchTerm ||
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.office.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesParty = !filterParty || p.party === filterParty
    const matchesLevel = !filterLevel || p.office_level === filterLevel

    return matchesSearch && matchesParty && matchesLevel
  })

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">Error: {error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    )
  }

  return (
    <div className="politician-list-page">
      <div className="page-header">
        <h1>Manage Politicians</h1>
        <Link to="/manage/add" className="btn-primary">Add Politician</Link>
      </div>

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or office..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <select
            value={filterParty}
            onChange={(e) => setFilterParty(e.target.value)}
          >
            <option value="">All Parties</option>
            {parties.map(party => (
              <option key={party} value={party}>{party}</option>
            ))}
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="results-count">
        Showing {filteredPoliticians.length} of {politicians.length} politicians
      </p>

      {filteredPoliticians.length === 0 ? (
        <div className="empty-state">
          {searchTerm || filterParty || filterLevel
            ? 'No politicians match your filters.'
            : 'No politicians added yet.'}
        </div>
      ) : (
        <div className="manage-politician-list">
          {filteredPoliticians.map((politician, index) => (
            <div key={politician.external_id || index} className="manage-politician-card">
              <div className="politician-info">
                <h3>{politician.full_name}</h3>
                <p className="politician-meta">
                  <span className="party">{politician.party}</span>
                  <span className="office">{politician.office}</span>
                  {politician.office_level && (
                    <span className="level">{politician.office_level}</span>
                  )}
                </p>
              </div>
              {politician.added_by && (
                <div className="added-by">
                  Added by {politician.added_by}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PoliticianList
