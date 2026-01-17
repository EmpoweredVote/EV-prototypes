import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { getData, acquireLock, releaseLock, approveReview, editAndResubmit } from '../../api/sheets'
import { useVolunteer } from '../../context/VolunteerContext'

function ReviewForm() {
  const { contextKey } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { volunteerName } = useVolunteer()

  const [stance, setStance] = useState(location.state?.stance || null)
  const [issue, setIssue] = useState(location.state?.issue || null)

  const [isEditing, setIsEditing] = useState(false)
  const [editedStance, setEditedStance] = useState(stance?.stance || '')
  const [editedReasoning, setEditedReasoning] = useState(stance?.reasoning || '')
  const [editedSources, setEditedSources] = useState(stance?.sources || '')

  const [loading, setLoading] = useState(!location.state?.stance)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [lockAcquired, setLockAcquired] = useState(false)

  useEffect(() => {
    if (!location.state?.stance) {
      loadData()
    } else {
      tryAcquireLock(decodeURIComponent(contextKey))
    }

    return () => {
      // Release lock on unmount
      if (lockAcquired) {
        releaseLock(decodeURIComponent(contextKey)).catch(() => {})
      }
    }
  }, [contextKey])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()

      const decodedKey = decodeURIComponent(contextKey)
      const foundStance = data.stances.find(s => s.context_key === decodedKey)
      const foundIssue = foundStance ? data.issues.find(i => i.topic_key === foundStance.topic_key) : null

      if (!foundStance) {
        setError('Stance not found')
        return
      }

      setStance(foundStance)
      setIssue(foundIssue)
      setEditedStance(foundStance.stance)
      setEditedReasoning(foundStance.reasoning)
      setEditedSources(foundStance.sources)

      await tryAcquireLock(decodedKey)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tryAcquireLock = async (key) => {
    try {
      const result = await acquireLock(key, volunteerName)
      if (result.success) {
        setLockAcquired(true)
      } else if (result.locked) {
        setError(result.message)
      }
    } catch (err) {
      console.error('Failed to acquire lock:', err)
    }
  }

  const handleApprove = async () => {
    try {
      setSaving(true)
      setError(null)

      const result = await approveReview(decodeURIComponent(contextKey), volunteerName)

      if (result.success) {
        navigate('/review')
      } else {
        setError(result.error || 'Failed to approve')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditAndResubmit = async () => {
    if (!editedStance) {
      setError('Please select a stance')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const result = await editAndResubmit({
        context_key: decodeURIComponent(contextKey),
        stance: editedStance,
        reasoning: editedReasoning,
        sources: editedSources,
        volunteer_name: volunteerName
      })

      if (result.success) {
        navigate('/review')
      } else {
        setError(result.error || 'Failed to submit')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const getStanceText = (stanceValue) => {
    if (!issue) return `Stance ${stanceValue}`
    const texts = [issue.stance1, issue.stance2, issue.stance3, issue.stance4, issue.stance5]
    return texts[stanceValue - 1] || `Stance ${stanceValue}`
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!stance || !issue) {
    return (
      <div className="error-container">
        <p className="error">{error || 'Stance not found'}</p>
        <Link to="/review" className="btn-secondary">Back to Queue</Link>
      </div>
    )
  }

  const stanceOptions = [
    { value: 1, text: issue.stance1 },
    { value: 2, text: issue.stance2 },
    { value: 3, text: issue.stance3 },
    { value: 4, text: issue.stance4 },
    { value: 5, text: issue.stance5 }
  ].filter(opt => opt.text)

  return (
    <div className="review-form">
      <div className="page-header">
        <div>
          <h1>Review: {stance.politician_name}</h1>
          <p className="issue-title">{issue.title}</p>
        </div>
        <Link to="/review" className="btn-secondary">Back to Queue</Link>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="review-content">
        <div className="review-meta-info">
          <p><strong>Author:</strong> {stance.added_by}</p>
          {stance.review_count > 0 && (
            <p><strong>Current approvals:</strong> {stance.review_count}/2</p>
          )}
          {stance.reviewed_by && (
            <p><strong>Reviewed by:</strong> {stance.reviewed_by}</p>
          )}
        </div>

        {!isEditing ? (
          <>
            <div className="current-stance">
              {issue.startPhrase && (
                <p className="start-phrase">{issue.startPhrase}</p>
              )}
              <div className="stance-display">
                <span className="stance-number">{stance.stance}</span>
                <span className="stance-text">{getStanceText(stance.stance)}</span>
              </div>
            </div>

            {stance.reasoning && (
              <div className="reasoning-display">
                <h3>Reasoning</h3>
                <p>{stance.reasoning}</p>
              </div>
            )}

            {stance.sources && (
              <div className="sources-display">
                <h3>Sources</h3>
                <ul>
                  {stance.sources.split(';').map((source, i) => (
                    <li key={i}>
                      <a href={source.trim()} target="_blank" rel="noopener noreferrer">
                        {source.trim()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="review-actions">
              <button
                onClick={handleApprove}
                disabled={saving || !lockAcquired}
                className="btn-primary"
              >
                {saving ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                disabled={saving || !lockAcquired}
                className="btn-secondary"
              >
                Edit & Resubmit
              </button>
            </div>
          </>
        ) : (
          <>
            {issue.startPhrase && (
              <p className="start-phrase">{issue.startPhrase}</p>
            )}

            <div className="stance-selector">
              <label>Select Stance</label>
              {stanceOptions.map(opt => (
                <label key={opt.value} className={`stance-option ${editedStance == opt.value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="stance"
                    value={opt.value}
                    checked={editedStance == opt.value}
                    onChange={(e) => setEditedStance(Number(e.target.value))}
                  />
                  <span className="stance-number">{opt.value}</span>
                  <span className="stance-text">{opt.text}</span>
                </label>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="reasoning">Reasoning</label>
              <textarea
                id="reasoning"
                value={editedReasoning}
                onChange={(e) => setEditedReasoning(e.target.value)}
                placeholder="Explain why this politician holds this position..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sources">Sources (semicolon-separated URLs)</label>
              <textarea
                id="sources"
                value={editedSources}
                onChange={(e) => setEditedSources(e.target.value)}
                placeholder="https://example.com/article1; https://example.com/article2"
                rows={2}
              />
            </div>

            <div className="form-actions">
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAndResubmit}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Submitting...' : 'Submit as New Author'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ReviewForm
