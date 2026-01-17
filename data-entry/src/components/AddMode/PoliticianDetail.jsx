import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { getData } from '../../api/sheets'
import { useVolunteer } from '../../context/VolunteerContext'

function PoliticianDetail() {
  const { politicianId } = useParams()
  const location = useLocation()
  const { volunteerName } = useVolunteer()

  const [politician, setPolitician] = useState(location.state?.politician || null)
  const [issues, setIssues] = useState(location.state?.issues || [])
  const [stances, setStances] = useState(location.state?.stances || [])
  const [loading, setLoading] = useState(!location.state)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!location.state) {
      loadData()
    }
  }, [politicianId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()
      setIssues(data.issues)
      setStances(data.stances)

      // Find the politician
      const found = data.politicians.find(p => {
        const id = p.external_id || `new_${p.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${p._rowIndex}`
        return id === politicianId || decodeURIComponent(politicianId) === id
      })

      if (found) {
        setPolitician(found)
      } else {
        setError('Politician not found')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStanceForIssue = (issue) => {
    return stances.find(s =>
      s.topic_key === issue.topic_key &&
      (s.politician_external_id === (politician?.external_id || politicianId) ||
       s.politician_name === politician?.full_name)
    )
  }

  const getStatusIcon = (stance) => {
    if (!stance) return { icon: '○', label: 'Missing', class: 'missing' }
    if (stance.status === 'approved') return { icon: '✓', label: 'Approved', class: 'approved' }
    if (stance.status === 'needs_review') return { icon: '⏳', label: 'Needs Review', class: 'review' }
    if (stance.added_by === volunteerName) return { icon: '✎', label: 'Your Draft', class: 'draft' }
    return { icon: '✎', label: 'Draft', class: 'draft' }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">Error: {error}</p>
        <Link to="/add/queue" className="btn-secondary">Back to Queue</Link>
      </div>
    )
  }

  if (!politician) {
    return (
      <div className="error-container">
        <p className="error">Politician not found</p>
        <Link to="/add/queue" className="btn-secondary">Back to Queue</Link>
      </div>
    )
  }

  return (
    <div className="politician-detail">
      <div className="page-header">
        <div>
          <h1>{politician.full_name}</h1>
          <p className="politician-meta">
            {politician.party} &middot; {politician.office}
            {politician.office_level && ` (${politician.office_level})`}
          </p>
        </div>
        <Link to="/add/queue" className="btn-secondary">Back to Queue</Link>
      </div>

      <div className="issues-list">
        {issues.map(issue => {
          const stance = getStanceForIssue(issue)
          const status = getStatusIcon(stance)

          return (
            <Link
              key={issue.topic_key}
              to={`/add/stance/${encodeURIComponent(politicianId)}/${issue.topic_key}`}
              className={`issue-card ${status.class}`}
              state={{ politician, issue, stance }}
            >
              <div className="issue-status">
                <span className={`status-icon ${status.class}`}>{status.icon}</span>
              </div>
              <div className="issue-info">
                <h3>{issue.shortTitle || issue.title}</h3>
                <p className="issue-status-label">{status.label}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default PoliticianDetail
