import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBuildingPhotoGaps, listBuildingPhotos } from '../../api/backend'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC'
]

function BuildingsGaps() {
  const [gaps, setGaps] = useState([])
  const [myPhotos, setMyPhotos] = useState([])
  const [stateFilter, setStateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [stateFilter])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [gapsData, photosData] = await Promise.all([
        getBuildingPhotoGaps(stateFilter || undefined),
        listBuildingPhotos()
      ])
      setGaps(gapsData)
      setMyPhotos(photosData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const draftCount = myPhotos.filter(p => p.status === 'draft').length
  const reviewCount = myPhotos.filter(p => p.status === 'needs_review').length
  const approvedCount = myPhotos.filter(p => p.status === 'approved').length

  return (
    <div className="buildings-gaps">
      <div className="page-header">
        <h1>Building Photos</h1>
        <p className="subtitle">Help fill in missing government building photos for local jurisdictions</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{gaps.length}</div>
          <div className="stat-label">Missing Photos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{draftCount}</div>
          <div className="stat-label">My Drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reviewCount}</div>
          <div className="stat-label">In Review</div>
        </div>
        <div className="stat-card stat-card--success">
          <div className="stat-number">{approvedCount}</div>
          <div className="stat-label">Approved</div>
        </div>
      </div>

      <div className="filter-bar">
        <select
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All States</option>
          {US_STATES.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading jurisdictions...</div>
      ) : gaps.length === 0 ? (
        <div className="empty-state">
          <p>No missing building photos found{stateFilter ? ` for ${stateFilter}` : ''}.</p>
        </div>
      ) : (
        <div className="gaps-table-wrapper">
          <table className="gaps-table">
            <thead>
              <tr>
                <th>Jurisdiction</th>
                <th>State</th>
                <th>Type</th>
                <th>Politicians</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map(gap => (
                <tr key={gap.geo_id}>
                  <td className="jurisdiction-name">{gap.city || gap.geo_id}</td>
                  <td>{gap.state}</td>
                  <td>
                    <span className={`district-badge district-badge--${gap.district_type.toLowerCase()}`}>
                      {gap.district_type === 'LOCAL_EXEC' ? 'City (Exec)' :
                       gap.district_type === 'LOCAL' ? 'City' :
                       gap.district_type === 'COUNTY' ? 'County' :
                       gap.district_type}
                    </span>
                  </td>
                  <td className="politician-count">{gap.politician_count}</td>
                  <td>
                    <Link
                      to={`/buildings/add?geo_id=${gap.geo_id}&name=${encodeURIComponent(gap.city || '')}&state=${gap.state}`}
                      className="btn-small btn-primary"
                    >
                      Add Photo
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BuildingsGaps
