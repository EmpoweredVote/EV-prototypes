import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { getData, addStance, updateStance, submitForReview, acquireLock, releaseLock } from '../../api/sheets'
import { useVolunteer } from '../../context/VolunteerContext'

function StanceForm() {
  const { politicianId, topicKey } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { volunteerName } = useVolunteer()

  const [politician, setPolitician] = useState(location.state?.politician || null)
  const [issue, setIssue] = useState(location.state?.issue || null)
  const [existingStance, setExistingStance] = useState(location.state?.stance || null)

  const [stance, setStance] = useState(existingStance?.stance || '')
  const [reasoning, setReasoning] = useState(existingStance?.reasoning || '')
  const [sources, setSources] = useState(existingStance?.sources || '')

  const [loading, setLoading] = useState(!location.state?.issue)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [lockError, setLockError] = useState(null)

  useEffect(() => {
    if (!location.state?.issue) {
      loadData()
    } else if (existingStance?.context_key) {
      tryAcquireLock()
    }

    return () => {
      // Release lock on unmount
      if (existingStance?.context_key) {
        releaseLock(existingStance.context_key).catch(() => {})
      }
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()

      // Find politician
      const foundPolitician = data.politicians.find(p => {
        const id = p.external_id || `new_${p.full_name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${p._rowIndex}`
        return id === politicianId || decodeURIComponent(politicianId) === id
      })

      // Find issue
      const foundIssue = data.issues.find(i => i.topic_key === topicKey)

      // Find existing stance
      const foundStance = data.stances.find(s =>
        s.topic_key === topicKey &&
        (s.politician_external_id === (foundPolitician?.external_id || politicianId) ||
         s.politician_name === foundPolitician?.full_name)
      )

      setPolitician(foundPolitician)
      setIssue(foundIssue)
      setExistingStance(foundStance)

      if (foundStance) {
        setStance(foundStance.stance)
        setReasoning(foundStance.reasoning)
        setSources(foundStance.sources)

        // Try to acquire lock
        if (foundStance.context_key) {
          const lockResult = await acquireLock(foundStance.context_key, volunteerName)
          if (!lockResult.success && lockResult.locked) {
            setLockError(lockResult.message)
          }
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tryAcquireLock = async () => {
    try {
      const lockResult = await acquireLock(existingStance.context_key, volunteerName)
      if (!lockResult.success && lockResult.locked) {
        setLockError(lockResult.message)
      }
    } catch (err) {
      console.error('Failed to acquire lock:', err)
    }
  }

  const handleSaveDraft = async () => {
    if (!stance) {
      setError('Please select a stance')
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (existingStance?.context_key) {
        await updateStance({
          context_key: existingStance.context_key,
          stance,
          reasoning,
          sources
        })
      } else {
        await addStance({
          politician_name: politician.full_name,
          politician_external_id: politician.external_id || '',
          topic_key: issue.topic_key,
          stance,
          reasoning,
          sources,
          added_by: volunteerName
        })
      }

      navigate(`/add/politician/${encodeURIComponent(politicianId)}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    if (!stance) {
      setError('Please select a stance')
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (existingStance?.context_key) {
        await updateStance({
          context_key: existingStance.context_key,
          stance,
          reasoning,
          sources
        })
        await submitForReview(existingStance.context_key)
      } else {
        const result = await addStance({
          politician_name: politician.full_name,
          politician_external_id: politician.external_id || '',
          topic_key: issue.topic_key,
          stance,
          reasoning,
          sources,
          added_by: volunteerName
        })

        if (result.context_key) {
          await submitForReview(result.context_key)
        }
      }

      navigate(`/add/politician/${encodeURIComponent(politicianId)}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!politician || !issue) {
    return (
      <div className="error-container">
        <p className="error">Politician or issue not found</p>
        <Link to="/add/queue" className="btn-secondary">Back to Queue</Link>
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

  const canEdit = !existingStance || existingStance.status === 'draft' || existingStance.added_by === volunteerName
  const isLocked = lockError !== null

  return (
    <div className="stance-form">
      <div className="page-header">
        <div>
          <h1>{politician.full_name}</h1>
          <p className="issue-title">{issue.title}</p>
        </div>
        <Link to={`/add/politician/${encodeURIComponent(politicianId)}`} className="btn-secondary">
          Back to Issues
        </Link>
      </div>

      {lockError && (
        <div className="warning-banner">
          {lockError}
        </div>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="form-content">
        {issue.startPhrase && (
          <p className="start-phrase">{issue.startPhrase}</p>
        )}

        <div className="stance-selector">
          <label>Select Stance</label>
          {stanceOptions.map(opt => (
            <label key={opt.value} className={`stance-option ${stance == opt.value ? 'selected' : ''}`}>
              <input
                type="radio"
                name="stance"
                value={opt.value}
                checked={stance == opt.value}
                onChange={(e) => setStance(Number(e.target.value))}
                disabled={isLocked && !canEdit}
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
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            placeholder="Explain why this politician holds this position..."
            rows={4}
            disabled={isLocked && !canEdit}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sources">Sources (semicolon-separated URLs)</label>
          <textarea
            id="sources"
            value={sources}
            onChange={(e) => setSources(e.target.value)}
            placeholder="https://example.com/article1; https://example.com/article2"
            rows={2}
            disabled={isLocked && !canEdit}
          />
        </div>

        {canEdit && !isLocked && (
          <div className="form-actions">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="btn-secondary"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleSubmitForReview}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StanceForm
