import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  getData, getEssentialsPolitician, updatePolitician,
  submitPoliticianForReview, approvePoliticianDirect
} from '../../api/sheets'
import { useAuth } from '../../context/AuthContext'
import { OFFICE_LEVEL_LABELS } from './politicianConstants'

function PoliticianDetailManage() {
  const { politicianId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [politician, setPolitician] = useState(null)
  const [essentialsData, setEssentialsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [politicianId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()
      const found = data.politicians.find(p => p.id === politicianId)
      if (!found) {
        setError('Politician not found')
        return
      }
      setPolitician(found)

      // If essentials, fetch full data
      if (found.source === 'essentials') {
        try {
          const full = await getEssentialsPolitician(found.id)
          setEssentialsData(full)
        } catch (err) {
          console.warn('Could not fetch full essentials data:', err.message)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditEssentials = () => {
    // Build prefill from essentials full data (or fallback to basic)
    const d = essentialsData
    const p = politician
    navigate('/manage/add', {
      state: {
        prefill: {
          external_id: p.external_id,
          full_name: d?.full_name || p.full_name,
          party: d?.party || p.party,
          office: d?.office_title || p.office,
          office_level: p.office_level,
          state: d?.representing_state || p.state,
          district: d?.district_label || p.district,
          bio_text: d?.bio_text || '',
          photo_url: d?.photo_origin_url || '',
          urls: d?.urls || [],
          web_form_url: d?.web_form_url || '',
          email_addresses: d?.email_addresses || [],
          valid_from: d?.term_start || '',
          valid_to: d?.term_end || '',
          total_years_in_office: d?.total_years_in_office || 0,
          office_description: d?.office_description || '',
          office_seats: d?.seats || 0,
          partisan_type: d?.partisan_type || '',
          salary: d?.salary || '',
          normalized_position_name: d?.normalized_position_name || '',
          district_type: d?.district_type || '',
          district_ocd_id: d?.ocd_id || '',
          district_geo_id: d?.geo_id || '',
          chamber_name: d?.chamber_name || '',
          election_frequency: d?.election_frequency || '',
          is_appointed: d?.is_appointed || false,
          is_vacant: d?.is_vacant || false,
          // Map essentials data to staging field shapes
          contacts: [
            ...(d?.email_addresses || []).filter(Boolean).map(e => ({ type: 'email', value: e })),
            ...(d?.addresses || []).flatMap(a => [
              a.phone_1 ? { type: 'phone', value: a.phone_1 } : null,
              a.phone_2 ? { type: 'phone', value: a.phone_2 } : null,
            ].filter(Boolean)),
          ],
          degrees: (d?.degrees || []).map(deg => ({
            degree: deg.degree || '',
            major: deg.major || '',
            school: deg.school || '',
            grad_year: deg.grad_year ? String(deg.grad_year) : '',
          })),
          experiences: (d?.experiences || []).map(exp => ({
            title: exp.title || '',
            organization: exp.organization || '',
            type: exp.type || 'work',
            start: exp.start || '',
            end: exp.end || '',
          })),
          images: (d?.images || []).map(img => ({
            url: img.url || '',
            type: img.type || 'default',
          })),
          addresses: (d?.addresses || []).map(a => ({
            address_1: a.address_1 || '',
            address_2: a.address_2 || '',
            state: a.state || '',
            postal_code: a.postal_code || '',
            phone_1: a.phone_1 || '',
            phone_2: a.phone_2 || '',
          })),
        }
      }
    })
  }

  const handleEditStaging = () => {
    // For staging politicians, prefill from the staging data directly
    const p = politician
    navigate('/manage/add', {
      state: {
        prefill: {
          staging_id: p.id,
          external_id: p.external_id || '',
          full_name: p.full_name,
          party: p.party,
          office: p.office,
          office_level: p.office_level,
          state: p.state,
          district: p.district,
          bio_text: p.bio_text || '',
          photo_url: p.photo_url || '',
          urls: p.urls || [],
          web_form_url: p.web_form_url || '',
          valid_from: p.valid_from || '',
          valid_to: p.valid_to || '',
          total_years_in_office: p.total_years_in_office || 0,
          office_description: p.office_description || '',
          office_seats: p.office_seats || 0,
          partisan_type: p.partisan_type || '',
          salary: p.salary || '',
          normalized_position_name: p.normalized_position_name || '',
          district_type: p.district_type || p.district_type_full || '',
          district_ocd_id: p.district_ocd_id || '',
          district_geo_id: p.district_geo_id || '',
          chamber_name: p.chamber_name || '',
          term_limit: p.term_limit || '',
          term_length: p.term_length || '',
          election_frequency: p.election_frequency || '',
          is_appointed: p.is_appointed || false,
          is_vacant: p.is_vacant || false,
          contacts: Array.isArray(p.contacts) ? p.contacts : [],
          degrees: Array.isArray(p.degrees) ? p.degrees : [],
          experiences: Array.isArray(p.experiences) ? p.experiences : [],
          images: Array.isArray(p.images) ? p.images : [],
          addresses: Array.isArray(p.addresses) ? p.addresses : [],
        }
      }
    })
  }

  const handleApprove = async () => {
    try {
      setSaving(true)
      setError(null)
      // First submit for review if still draft
      if (politician.status === 'draft' || politician.status === 'pending') {
        await submitPoliticianForReview(politicianId)
      }
      // Then approve
      await approvePoliticianDirect(politicianId)
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const isEssentials = politician?.source === 'essentials'
  const isStaging = politician?.source === 'staging'
  const canEdit = isStaging && (politician?.status === 'draft' || politician?.status === 'pending')
  const canApprove = isStaging && (politician?.status === 'draft' || politician?.status === 'pending' || politician?.status === 'needs_review')

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!politician) {
    return (
      <div className="error-container">
        <p className="error">{error || 'Politician not found'}</p>
        <Link to="/manage" className="btn-secondary">Back to List</Link>
      </div>
    )
  }

  // Use essentials full data if available, otherwise politician from list
  const d = essentialsData || politician

  return (
    <div className="politician-detail-page">
      <div className="page-header">
        <div>
          <h1>{politician.full_name}</h1>
          <p className="subtitle">
            {d.office_title || politician.office}
            {(d.representing_state || politician.state) && ` - ${d.representing_state || politician.state}`}
          </p>
        </div>
        <Link to="/manage" className="btn-secondary">Back to List</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="review-content">
        <div className="review-meta-info">
          {isEssentials ? (
            <p><strong>Source:</strong> <span className="status-badge status-approved">BallotReady</span></p>
          ) : (
            <>
              <p><strong>Status:</strong> <span className={`status-badge status-${politician.status === 'pending' ? 'draft' : politician.status}`}>
                {politician.status === 'pending' ? 'Draft' : politician.status === 'needs_review' ? 'In Review' : politician.status}
              </span></p>
              <p><strong>Added by:</strong> {politician.added_by === user.user_id ? 'You' : politician.added_by}</p>
              {politician.review_count > 0 && (
                <p><strong>Approvals:</strong> {politician.review_count}/1</p>
              )}
            </>
          )}
        </div>

        <div className="politician-detail-sections">
          {/* Core Info */}
          <div className="politician-detail-section">
            <h3>Core Info</h3>
            <div className="detail-field"><strong>Full Name:</strong> {d.full_name || politician.full_name}</div>
            <div className="detail-field"><strong>Party:</strong> {d.party || politician.party || 'Not specified'}</div>
            {d.party_short_name && <div className="detail-field"><strong>Party (short):</strong> {d.party_short_name}</div>}
            <div className="detail-field"><strong>Office:</strong> {d.office_title || politician.office}</div>
            <div className="detail-field"><strong>Level:</strong> {OFFICE_LEVEL_LABELS[politician.office_level] || politician.office_level || d.district_type || 'Not specified'}</div>
            <div className="detail-field"><strong>State:</strong> {d.representing_state || politician.state}</div>
            {(d.district_label || politician.district) && <div className="detail-field"><strong>District:</strong> {d.district_label || politician.district}</div>}
            {d.representing_city && <div className="detail-field"><strong>City:</strong> {d.representing_city}</div>}
          </div>

          {/* Term & Status */}
          {(d.term_start || d.term_end || d.valid_from || d.valid_to || d.total_years_in_office || d.is_appointed || d.is_vacant || d.election_frequency) && (
            <div className="politician-detail-section">
              <h3>Term & Status</h3>
              {(d.term_start || d.valid_from) && <div className="detail-field"><strong>Term Start:</strong> {d.term_start || d.valid_from}</div>}
              {(d.term_end || d.valid_to) && <div className="detail-field"><strong>Term End:</strong> {d.term_end || d.valid_to}</div>}
              {d.total_years_in_office > 0 && <div className="detail-field"><strong>Total Years in Office:</strong> {d.total_years_in_office}</div>}
              {d.election_frequency && <div className="detail-field"><strong>Election Frequency:</strong> {d.election_frequency}</div>}
              {d.is_appointed && <div className="detail-field"><strong>Appointed:</strong> Yes</div>}
              {d.is_vacant && <div className="detail-field"><strong>Vacant:</strong> Yes</div>}
              {d.is_off_cycle && <div className="detail-field"><strong>Off-Cycle:</strong> Yes</div>}
            </div>
          )}

          {/* Office Details */}
          {(d.office_description || d.seats || d.partisan_type || d.salary || d.normalized_position_name) && (
            <div className="politician-detail-section">
              <h3>Office Details</h3>
              {d.office_description && <div className="detail-field"><strong>Description:</strong> {d.office_description}</div>}
              {d.normalized_position_name && <div className="detail-field"><strong>Position:</strong> {d.normalized_position_name}</div>}
              {d.seats > 0 && <div className="detail-field"><strong>Seats:</strong> {d.seats}</div>}
              {d.partisan_type && <div className="detail-field"><strong>Partisan Type:</strong> {d.partisan_type}</div>}
              {d.salary && <div className="detail-field"><strong>Salary:</strong> {d.salary}</div>}
              {d.chamber_name && <div className="detail-field"><strong>Chamber:</strong> {d.chamber_name}</div>}
              {d.chamber_name_formal && <div className="detail-field"><strong>Chamber (formal):</strong> {d.chamber_name_formal}</div>}
              {d.government_name && <div className="detail-field"><strong>Government:</strong> {d.government_name}</div>}
            </div>
          )}

          {/* District & Geo */}
          {(d.district_type || d.geo_id || d.ocd_id || d.district_ocd_id || d.district_geo_id) && (
            <div className="politician-detail-section">
              <h3>District & Geo</h3>
              {d.district_type && <div className="detail-field"><strong>District Type:</strong> {d.district_type}</div>}
              {(d.geo_id || d.district_geo_id) && <div className="detail-field"><strong>Geo ID:</strong> {d.geo_id || d.district_geo_id}</div>}
              {(d.ocd_id || d.district_ocd_id) && <div className="detail-field"><strong>OCD-ID:</strong> {d.ocd_id || d.district_ocd_id}</div>}
              {d.mtfcc && <div className="detail-field"><strong>MTFCC:</strong> {d.mtfcc}</div>}
              {d.is_judicial && <div className="detail-field"><strong>Judicial:</strong> Yes</div>}
            </div>
          )}

          {/* URLs & Links */}
          {((d.urls && d.urls.length > 0) || d.web_form_url || (d.email_addresses && d.email_addresses.length > 0)) && (
            <div className="politician-detail-section">
              <h3>Links & Social</h3>
              {d.web_form_url && <div className="detail-field"><strong>Web Form:</strong> <a href={d.web_form_url} target="_blank" rel="noopener noreferrer">{d.web_form_url}</a></div>}
              {d.urls && d.urls.map((url, i) => (
                <div key={i} className="detail-field"><strong>URL:</strong> <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></div>
              ))}
              {d.email_addresses && d.email_addresses.map((email, i) => (
                <div key={i} className="detail-field"><strong>Email:</strong> {email}</div>
              ))}
            </div>
          )}

          {/* Bio & Photo */}
          {(d.bio_text || d.photo_origin_url || d.photo_url || d.bioguide_id || d.slug) && (
            <div className="politician-detail-section">
              <h3>Bio & Photo</h3>
              {(d.photo_origin_url || d.photo_url) && (
                <div className="detail-field">
                  <img src={d.photo_origin_url || d.photo_url} alt={d.full_name || politician.full_name} className="politician-photo" />
                </div>
              )}
              {d.bio_text && <div className="detail-field">{d.bio_text}</div>}
              {d.bioguide_id && <div className="detail-field"><strong>Bioguide ID:</strong> {d.bioguide_id}</div>}
              {d.slug && <div className="detail-field"><strong>Slug:</strong> {d.slug}</div>}
            </div>
          )}

          {/* Images */}
          {d.images && d.images.length > 0 && (
            <div className="politician-detail-section">
              <h3>Images</h3>
              {d.images.map((img, i) => (
                <div key={i} className="detail-field">
                  <strong>{img.type}:</strong> <a href={img.url} target="_blank" rel="noopener noreferrer">{img.url}</a>
                </div>
              ))}
            </div>
          )}

          {/* Contacts */}
          {((Array.isArray(d.contacts) && d.contacts.length > 0) || (Array.isArray(politician.contacts) && politician.contacts.length > 0)) && (
            <div className="politician-detail-section">
              <h3>Contacts</h3>
              {(Array.isArray(d.contacts) ? d.contacts : politician.contacts).map((c, i) => (
                <div key={i} className="detail-field">
                  <strong>{c.type || c.contact_type || 'Contact'}:</strong> {c.value || c.email || c.phone || c.fax || ''}
                </div>
              ))}
            </div>
          )}

          {/* Addresses */}
          {d.addresses && d.addresses.length > 0 && (
            <div className="politician-detail-section">
              <h3>Addresses</h3>
              {d.addresses.map((a, i) => (
                <div key={i} className="detail-field">
                  {[a.address_1, a.address_2, a.address_3].filter(Boolean).join(', ')}
                  {a.state && `, ${a.state}`}
                  {a.postal_code && ` ${a.postal_code}`}
                  {a.phone_1 && <span> | Phone: {a.phone_1}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {((d.degrees && d.degrees.length > 0) || (Array.isArray(politician.degrees) && politician.degrees.length > 0)) && (
            <div className="politician-detail-section">
              <h3>Education</h3>
              {(d.degrees || politician.degrees).map((deg, i) => (
                <div key={i} className="detail-field">
                  {deg.degree}{deg.major ? ` in ${deg.major}` : ''}{deg.school ? ` - ${deg.school}` : ''}{deg.grad_year ? ` (${deg.grad_year})` : ''}
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {((d.experiences && d.experiences.length > 0) || (Array.isArray(politician.experiences) && politician.experiences.length > 0)) && (
            <div className="politician-detail-section">
              <h3>Experience</h3>
              {(d.experiences || politician.experiences).map((exp, i) => (
                <div key={i} className="detail-field">
                  <strong>{exp.title}</strong>{exp.organization ? ` at ${exp.organization}` : ''}
                  {(exp.start || exp.end) && (
                    <span className="exp-dates"> ({exp.start || '?'} - {exp.end || 'Present'})</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Committees */}
          {d.committees && d.committees.length > 0 && (
            <div className="politician-detail-section">
              <h3>Committees</h3>
              {d.committees.map((c, i) => (
                <div key={i} className="detail-field">
                  <strong>{c.name}</strong>{c.position ? ` (${c.position})` : ''}
                </div>
              ))}
            </div>
          )}

          {/* Identifiers */}
          {d.identifiers && d.identifiers.length > 0 && (
            <div className="politician-detail-section">
              <h3>Identifiers</h3>
              {d.identifiers.map((id, i) => (
                <div key={i} className="detail-field">
                  <strong>{id.identifier_type}:</strong> {id.identifier_value}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="review-actions">
          {isEssentials && (
            <button onClick={handleEditEssentials} className="btn-primary">
              Edit Politician
            </button>
          )}
          {canEdit && (
            <button onClick={handleEditStaging} className="btn-secondary" disabled={saving}>
              Edit
            </button>
          )}
          {canApprove && (
            <button onClick={handleApprove} className="btn-primary" disabled={saving}>
              {saving ? 'Approving...' : 'Approve & Merge'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PoliticianDetailManage
