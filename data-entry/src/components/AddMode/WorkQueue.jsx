import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../../api/sheets'

function WorkQueue() {
  const [politicians, setPoliticians] = useState([])
  const [issues, setIssues] = useState([])
  const [stances, setStances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()
      setPoliticians(data.politicians)
      setIssues(data.issues)
      setStances(data.stances)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getPoliticianId = (politician) => {
    return politician.external_id || `new_${politician.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${politician._rowIndex}`
  }

  const getCompletionStatus = (politician) => {
    const politicianId = politician.external_id || getPoliticianId(politician)
    const politicianStances = stances.filter(s =>
      s.politician_external_id === politicianId ||
      s.politician_name === politician.full_name
    )
    return {
      completed: politicianStances.length,
      total: issues.length
    }
  }

  const filteredPoliticians = politicians.filter(p => {
    const term = searchTerm.toLowerCase()
    return p.full_name.toLowerCase().includes(term) ||
           p.party.toLowerCase().includes(term) ||
           p.office.toLowerCase().includes(term)
  })

  // Sort by completion (least complete first)
  const sortedPoliticians = [...filteredPoliticians].sort((a, b) => {
    const statusA = getCompletionStatus(a)
    const statusB = getCompletionStatus(b)
    return (statusA.completed / statusA.total) - (statusB.completed / statusB.total)
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
    <div className="work-queue">
      <div className="page-header">
        <h1>Work Queue</h1>
        <Link to="/add" className="btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search politicians..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {sortedPoliticians.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? 'No politicians match your search.' : 'No politicians found. Add some politicians first!'}
        </div>
      ) : (
        <div className="politician-list">
          {sortedPoliticians.map(politician => {
            const status = getCompletionStatus(politician)
            const politicianId = getPoliticianId(politician)
            const isComplete = status.completed === status.total

            return (
              <Link
                key={politicianId}
                to={`/add/politician/${encodeURIComponent(politicianId)}`}
                className={`politician-card ${isComplete ? 'complete' : ''}`}
                state={{ politician, issues, stances }}
              >
                <div className="politician-info">
                  <h3>{politician.full_name}</h3>
                  <p className="politician-meta">
                    {politician.party} &middot; {politician.office}
                    {politician.office_level && ` (${politician.office_level})`}
                  </p>
                </div>
                <div className="completion-badge">
                  {status.completed} of {status.total} issues
                  {isComplete && <span className="complete-check"> &#10003;</span>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WorkQueue
