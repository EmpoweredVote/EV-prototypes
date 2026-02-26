import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getBuildingPhotoReviewQueue,
  approveBuildingPhotoReview,
  rejectBuildingPhoto,
  adminApproveBuildingPhoto,
} from '../../api/backend'

function BuildingPhotoReview() {
  const { user } = useAuth()
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [rejectComment, setRejectComment] = useState('')
  const [showReject, setShowReject] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadQueue()
  }, [])

  async function loadQueue() {
    setLoading(true)
    try {
      const data = await getBuildingPhotoReviewQueue()
      setQueue(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id) {
    setActionLoading(true)
    setError(null)
    try {
      await approveBuildingPhotoReview(id)
      setQueue(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject(id) {
    setActionLoading(true)
    setError(null)
    try {
      await rejectBuildingPhoto(id, rejectComment)
      setQueue(prev => prev.filter(p => p.id !== id))
      setShowReject(null)
      setRejectComment('')
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading review queue...</div>

  return (
    <div className="building-review">
      <div className="page-header">
        <h1>Review Building Photos</h1>
        <p className="subtitle">Review and approve submitted building photos</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {queue.length === 0 ? (
        <div className="empty-state">
          <p>No building photos waiting for review.</p>
        </div>
      ) : (
        <div className="review-grid">
          {queue.map(photo => (
            <div key={photo.id} className="review-card">
              <div className="review-card-image">
                <img src={photo.url} alt={photo.place_name} />
              </div>
              <div className="review-card-info">
                <h3>{photo.place_name}</h3>
                <p className="review-meta">{photo.state} &middot; GeoID: {photo.place_geoid}</p>
                <div className="review-details">
                  <div className="detail-row">
                    <span className="detail-label">License:</span>
                    <span>{photo.license.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Attribution:</span>
                    <span>{photo.attribution}</span>
                  </div>
                  {photo.source_url && (
                    <div className="detail-row">
                      <span className="detail-label">Source:</span>
                      <a href={photo.source_url} target="_blank" rel="noopener noreferrer">View source</a>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Submitted by:</span>
                    <span>{photo.added_by}</span>
                  </div>
                </div>

                {showReject === photo.id ? (
                  <div className="reject-form">
                    <textarea
                      value={rejectComment}
                      onChange={e => setRejectComment(e.target.value)}
                      placeholder="Reason for rejection (optional)"
                      rows={2}
                    />
                    <div className="reject-actions">
                      <button
                        onClick={() => handleReject(photo.id)}
                        className="btn-small btn-danger"
                        disabled={actionLoading}
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => { setShowReject(null); setRejectComment(''); }}
                        className="btn-small btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="review-actions">
                    <button
                      onClick={() => handleApprove(photo.id)}
                      className="btn btn-primary"
                      disabled={actionLoading}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setShowReject(photo.id)}
                      className="btn btn-danger"
                      disabled={actionLoading}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BuildingPhotoReview
