import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPoliticianReviewQueue } from '../../api/sheets'
import { useAuth } from '../../context/AuthContext'
import { OFFICE_LEVEL_LABELS } from '../ManageMode/politicianConstants'

function PoliticianReviewQueue() {
  const { user } = useAuth()
  const [politicians, setPoliticians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [user.user_id])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPoliticianReviewQueue()
      setPoliticians(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
    <div className="review-queue">
      <div className="page-header">
        <h1>Review Politicians</h1>
        <Link to="/" className="btn-secondary">Back to Home</Link>
      </div>

      {politicians.length === 0 ? (
        <div className="empty-state">
          <p>No politicians available for review right now.</p>
          <p className="empty-hint">Politicians appear here when:</p>
          <ul>
            <li>They've been submitted for review</li>
            <li>They weren't authored by you</li>
            <li>You haven't already reviewed them</li>
            <li>They're not currently being edited by someone else</li>
          </ul>
        </div>
      ) : (
        <>
          <p className="queue-count">{politicians.length} politician{politicians.length !== 1 ? 's' : ''} ready for review</p>
          <div className="review-list">
            {politicians.map(politician => (
              <Link
                key={politician.id}
                to={`/review/politician/${politician.id}`}
                className="review-card"
                state={{ politician }}
              >
                <div className="review-info">
                  <h3>{politician.full_name}</h3>
                  <p className="review-issue">
                    {politician.office}
                    {politician.state && ` - ${politician.state}`}
                    {politician.office_level && (
                      <span className="office-level-tag"> ({OFFICE_LEVEL_LABELS[politician.office_level] || politician.office_level})</span>
                    )}
                  </p>
                </div>
                <div className="review-meta">
                  <span className="author">by {politician.added_by}</span>
                  {politician.review_count > 0 && (
                    <span className="review-count">{politician.review_count}/2 approvals</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default PoliticianReviewQueue
