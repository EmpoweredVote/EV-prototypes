import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../../api/sheets'
import { useVolunteer } from '../../context/VolunteerContext'
import { LOCK_TIMEOUT_MS } from '../../config'

function ReviewQueue() {
  const { volunteerName } = useVolunteer()
  const [reviewableStances, setReviewableStances] = useState([])
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [volunteerName])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()

      setIssues(data.issues)

      // Filter for reviewable stances
      const now = Date.now()
      const reviewable = data.stances.filter(stance => {
        // Must be needs_review status
        if (stance.status !== 'needs_review') return false

        // Can't review your own work
        if (stance.added_by === volunteerName) return false

        // Can't review if already reviewed
        const reviewedBy = stance.reviewed_by ? stance.reviewed_by.split(',') : []
        if (reviewedBy.includes(volunteerName)) return false

        // Check if locked by someone else
        if (stance.locked_by && stance.locked_by !== volunteerName) {
          const lockTime = new Date(stance.locked_at).getTime()
          if (now - lockTime < LOCK_TIMEOUT_MS) {
            return false // Locked by someone else
          }
        }

        return true
      })

      setReviewableStances(reviewable)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getIssueTitle = (topicKey) => {
    const issue = issues.find(i => i.topic_key === topicKey)
    return issue ? (issue.shortTitle || issue.title) : topicKey
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
        <h1>Review Queue</h1>
        <Link to="/" className="btn-secondary">Back to Home</Link>
      </div>

      {reviewableStances.length === 0 ? (
        <div className="empty-state">
          <p>No stances available for review right now.</p>
          <p className="empty-hint">Stances appear here when:</p>
          <ul>
            <li>They've been submitted for review</li>
            <li>They weren't authored by you</li>
            <li>You haven't already reviewed them</li>
            <li>They're not currently being edited by someone else</li>
          </ul>
        </div>
      ) : (
        <>
          <p className="queue-count">{reviewableStances.length} stance{reviewableStances.length !== 1 ? 's' : ''} ready for review</p>
          <div className="review-list">
            {reviewableStances.map(stance => (
              <Link
                key={stance.context_key}
                to={`/review/${encodeURIComponent(stance.context_key)}`}
                className="review-card"
                state={{ stance, issue: issues.find(i => i.topic_key === stance.topic_key) }}
              >
                <div className="review-info">
                  <h3>{stance.politician_name}</h3>
                  <p className="review-issue">{getIssueTitle(stance.topic_key)}</p>
                </div>
                <div className="review-meta">
                  <span className="author">by {stance.added_by}</span>
                  {stance.review_count > 0 && (
                    <span className="review-count">{stance.review_count}/2 approvals</span>
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

export default ReviewQueue
