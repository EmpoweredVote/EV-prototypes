import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getData, updatePolitician, submitPoliticianForReview } from '../../api/sheets'
import { useAuth } from '../../context/AuthContext'
import {
  PARTIES, OFFICES, OFFICE_LEVELS, STATES,
  CONTACT_TYPES, EXPERIENCE_TYPES, OFFICE_LEVEL_LABELS
} from './politicianConstants'

function PoliticianDetailManage() {
  const { politicianId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [politician, setPolitician] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // Editable fields
  const [fullName, setFullName] = useState('')
  const [party, setParty] = useState('')
  const [customParty, setCustomParty] = useState('')
  const [office, setOffice] = useState('')
  const [customOffice, setCustomOffice] = useState('')
  const [officeLevel, setOfficeLevel] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [bioText, setBioText] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [contacts, setContacts] = useState([])
  const [degrees, setDegrees] = useState([])
  const [experiences, setExperiences] = useState([])
  const [openSections, setOpenSections] = useState({})

  useEffect(() => {
    loadData()
  }, [politicianId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getData()
      const found = data.politicians.find(p => p.id === politicianId && p.source === 'staging')
      if (!found) {
        setError('Politician not found')
        return
      }
      setPolitician(found)
      populateForm(found)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const populateForm = (p) => {
    setFullName(p.full_name || '')
    // Check if party is in the PARTIES list or custom
    const isKnownParty = PARTIES.includes(p.party)
    setParty(isKnownParty ? p.party : (p.party ? 'Other' : ''))
    setCustomParty(isKnownParty ? '' : (p.party || ''))
    // Check if office is in OFFICES list or custom
    const isKnownOffice = OFFICES.some(o => o.value === p.office)
    setOffice(isKnownOffice ? p.office : (p.office ? 'Other' : ''))
    setCustomOffice(isKnownOffice ? '' : (p.office || ''))
    setOfficeLevel(p.office_level || '')
    setState(p.state || '')
    setDistrict(p.district || '')
    setBioText(p.bio_text || '')
    setPhotoURL(p.photo_url || '')
    setContacts(Array.isArray(p.contacts) ? p.contacts : [])
    setDegrees(Array.isArray(p.degrees) ? p.degrees : [])
    setExperiences(Array.isArray(p.experiences) ? p.experiences : [])
  }

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleOfficeChange = (newOffice) => {
    setOffice(newOffice)
    const selectedOffice = OFFICES.find(o => o.value === newOffice)
    if (selectedOffice && selectedOffice.level) {
      setOfficeLevel(selectedOffice.level)
    } else {
      setOfficeLevel('')
    }
  }

  // Contact/Degree/Experience helpers
  const addContact = () => setContacts([...contacts, { type: 'phone', value: '' }])
  const removeContact = (i) => setContacts(contacts.filter((_, idx) => idx !== i))
  const updateContact = (i, field, value) => {
    const updated = [...contacts]
    updated[i] = { ...updated[i], [field]: value }
    setContacts(updated)
  }

  const addDegree = () => setDegrees([...degrees, { degree: '', major: '', school: '', grad_year: '' }])
  const removeDegree = (i) => setDegrees(degrees.filter((_, idx) => idx !== i))
  const updateDegree = (i, field, value) => {
    const updated = [...degrees]
    updated[i] = { ...updated[i], [field]: value }
    setDegrees(updated)
  }

  const addExperience = () => setExperiences([...experiences, { title: '', organization: '', type: 'work', start: '', end: '' }])
  const removeExperience = (i) => setExperiences(experiences.filter((_, idx) => idx !== i))
  const updateExperience = (i, field, value) => {
    const updated = [...experiences]
    updated[i] = { ...updated[i], [field]: value }
    setExperiences(updated)
  }

  const handleSave = async () => {
    const finalParty = party === 'Other' ? customParty : party
    const finalOffice = office === 'Other' ? customOffice : office
    const validContacts = contacts.filter(c => c.value && c.value.trim())
    const validDegrees = degrees.filter(d => (d.school && d.school.trim()) || (d.degree && d.degree.trim()))
    const validExperiences = experiences.filter(x => (x.title && x.title.trim()) || (x.organization && x.organization.trim()))

    try {
      setSaving(true)
      setError(null)
      await updatePolitician(politicianId, {
        full_name: fullName.trim(),
        party: finalParty,
        office: finalOffice,
        office_level: officeLevel,
        state,
        district: district.trim(),
        bio_text: bioText.trim() || undefined,
        photo_url: photoURL.trim() || undefined,
        contacts: validContacts.length > 0 ? validContacts : undefined,
        degrees: validDegrees.length > 0 ? validDegrees : undefined,
        experiences: validExperiences.length > 0 ? validExperiences : undefined,
      })
      setIsEditing(false)
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitForReview = async () => {
    try {
      setSaving(true)
      setError(null)
      await submitPoliticianForReview(politicianId)
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const isAuthor = politician?.added_by === user?.user_id
  const canEdit = isAuthor && (politician?.status === 'draft' || politician?.status === 'pending')
  const canSubmit = isAuthor && (politician?.status === 'draft' || politician?.status === 'pending')

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

  const showDistrictField = office && !['US President', 'Governor', 'US Senate'].includes(office)
  const showOfficeLevelField = office === 'Other'

  return (
    <div className="politician-detail-page">
      <div className="page-header">
        <div>
          <h1>{politician.full_name}</h1>
          <p className="subtitle">
            {politician.office}
            {politician.state && ` - ${politician.state}`}
          </p>
        </div>
        <Link to="/manage" className="btn-secondary">Back to List</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="review-content">
        <div className="review-meta-info">
          <p><strong>Status:</strong> <span className={`status-badge status-${politician.status === 'pending' ? 'draft' : politician.status}`}>
            {politician.status === 'pending' ? 'Draft' : politician.status === 'needs_review' ? 'In Review' : politician.status}
          </span></p>
          <p><strong>Added by:</strong> {politician.added_by === user.user_id ? 'You' : politician.added_by}</p>
          {politician.review_count > 0 && (
            <p><strong>Approvals:</strong> {politician.review_count}/2</p>
          )}
          {Array.isArray(politician.reviewed_by) && politician.reviewed_by.length > 0 && (
            <p><strong>Reviewed by:</strong> {politician.reviewed_by.join(', ')}</p>
          )}
        </div>

        {!isEditing ? (
          <>
            <div className="politician-detail-sections">
              <div className="politician-detail-section">
                <h3>Core Info</h3>
                <div className="detail-field"><strong>Full Name:</strong> {politician.full_name}</div>
                <div className="detail-field"><strong>Party:</strong> {politician.party || 'Not specified'}</div>
                <div className="detail-field"><strong>Office:</strong> {politician.office}</div>
                <div className="detail-field"><strong>Level:</strong> {OFFICE_LEVEL_LABELS[politician.office_level] || politician.office_level || 'Not specified'}</div>
                <div className="detail-field"><strong>State:</strong> {politician.state}</div>
                {politician.district && <div className="detail-field"><strong>District:</strong> {politician.district}</div>}
              </div>

              {(politician.bio_text || politician.photo_url) && (
                <div className="politician-detail-section">
                  <h3>Bio & Photo</h3>
                  {politician.photo_url && (
                    <div className="detail-field">
                      <img src={politician.photo_url} alt={politician.full_name} className="politician-photo" />
                    </div>
                  )}
                  {politician.bio_text && <div className="detail-field">{politician.bio_text}</div>}
                </div>
              )}

              {Array.isArray(politician.contacts) && politician.contacts.length > 0 && (
                <div className="politician-detail-section">
                  <h3>Contacts</h3>
                  {politician.contacts.map((c, i) => (
                    <div key={i} className="detail-field">
                      <strong>{c.type}:</strong> {c.value}
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(politician.degrees) && politician.degrees.length > 0 && (
                <div className="politician-detail-section">
                  <h3>Education</h3>
                  {politician.degrees.map((d, i) => (
                    <div key={i} className="detail-field">
                      {d.degree}{d.major ? ` in ${d.major}` : ''}{d.school ? ` - ${d.school}` : ''}{d.grad_year ? ` (${d.grad_year})` : ''}
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(politician.experiences) && politician.experiences.length > 0 && (
                <div className="politician-detail-section">
                  <h3>Experience</h3>
                  {politician.experiences.map((exp, i) => (
                    <div key={i} className="detail-field">
                      <strong>{exp.title}</strong>{exp.organization ? ` at ${exp.organization}` : ''}
                      {(exp.start || exp.end) && (
                        <span className="exp-dates"> ({exp.start || '?'} - {exp.end || 'Present'})</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(canEdit || canSubmit) && (
              <div className="review-actions">
                {canEdit && (
                  <button onClick={() => setIsEditing(true)} className="btn-secondary" disabled={saving}>
                    Edit
                  </button>
                )}
                {canSubmit && (
                  <button onClick={handleSubmitForReview} className="btn-primary" disabled={saving}>
                    {saving ? 'Submitting...' : 'Submit for Review'}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="party">Party</label>
              <select id="party" value={party} onChange={(e) => setParty(e.target.value)}>
                <option value="">Select a party...</option>
                {PARTIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {party === 'Other' && (
              <div className="form-group">
                <label htmlFor="customParty">Custom Party Name</label>
                <input type="text" id="customParty" value={customParty} onChange={(e) => setCustomParty(e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="office">Office *</label>
              <select id="office" value={office} onChange={(e) => handleOfficeChange(e.target.value)} required>
                <option value="">Select an office...</option>
                {OFFICES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {office === 'Other' && (
              <div className="form-group">
                <label htmlFor="customOffice">Custom Office Name</label>
                <input type="text" id="customOffice" value={customOffice} onChange={(e) => setCustomOffice(e.target.value)} />
              </div>
            )}
            {showOfficeLevelField && (
              <div className="form-group">
                <label htmlFor="officeLevel">Office Level</label>
                <select id="officeLevel" value={officeLevel} onChange={(e) => setOfficeLevel(e.target.value)}>
                  <option value="">Select a level...</option>
                  {OFFICE_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <select id="state" value={state} onChange={(e) => setState(e.target.value)} required>
                <option value="">Select a state...</option>
                {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {showDistrictField && (
              <div className="form-group">
                <label htmlFor="district">District</label>
                <input type="text" id="district" value={district} onChange={(e) => setDistrict(e.target.value)} />
              </div>
            )}

            {/* Bio & Photo */}
            <div className={`collapsible-section ${openSections.bio ? 'open' : ''}`}>
              <div className="collapsible-header" onClick={() => toggleSection('bio')}>
                <span>+ Bio & Photo</span>
                <span className="collapsible-chevron" />
              </div>
              <div className="collapsible-content">
                <div className="form-group">
                  <label htmlFor="bioText">Biography</label>
                  <textarea id="bioText" value={bioText} onChange={(e) => setBioText(e.target.value)} rows={3} />
                </div>
                <div className="form-group">
                  <label htmlFor="photoURL">Photo URL</label>
                  <input type="url" id="photoURL" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className={`collapsible-section ${openSections.contacts ? 'open' : ''}`}>
              <div className="collapsible-header" onClick={() => toggleSection('contacts')}>
                <span>+ Contact Info</span>
                <span className="collapsible-chevron" />
              </div>
              <div className="collapsible-content">
                {contacts.map((contact, i) => (
                  <div key={i} className="repeatable-row">
                    <div className="form-group">
                      <label>Type</label>
                      <select value={contact.type} onChange={(e) => updateContact(i, 'type', e.target.value)}>
                        {CONTACT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Value</label>
                      <input type="text" value={contact.value} onChange={(e) => updateContact(i, 'value', e.target.value)} />
                    </div>
                    <button type="button" className="btn-remove-row" onClick={() => removeContact(i)}>&times;</button>
                  </div>
                ))}
                <button type="button" className="btn-add-row" onClick={addContact}>+ Add Contact</button>
              </div>
            </div>

            {/* Degrees */}
            <div className={`collapsible-section ${openSections.degrees ? 'open' : ''}`}>
              <div className="collapsible-header" onClick={() => toggleSection('degrees')}>
                <span>+ Education</span>
                <span className="collapsible-chevron" />
              </div>
              <div className="collapsible-content">
                {degrees.map((deg, i) => (
                  <div key={i} className="repeatable-row">
                    <div className="form-group"><label>Degree</label><input type="text" value={deg.degree} onChange={(e) => updateDegree(i, 'degree', e.target.value)} /></div>
                    <div className="form-group"><label>Major</label><input type="text" value={deg.major} onChange={(e) => updateDegree(i, 'major', e.target.value)} /></div>
                    <div className="form-group"><label>School</label><input type="text" value={deg.school} onChange={(e) => updateDegree(i, 'school', e.target.value)} /></div>
                    <div className="form-group" style={{ maxWidth: 100 }}><label>Year</label><input type="text" value={deg.grad_year} onChange={(e) => updateDegree(i, 'grad_year', e.target.value)} /></div>
                    <button type="button" className="btn-remove-row" onClick={() => removeDegree(i)}>&times;</button>
                  </div>
                ))}
                <button type="button" className="btn-add-row" onClick={addDegree}>+ Add Degree</button>
              </div>
            </div>

            {/* Experiences */}
            <div className={`collapsible-section ${openSections.experiences ? 'open' : ''}`}>
              <div className="collapsible-header" onClick={() => toggleSection('experiences')}>
                <span>+ Work Experience</span>
                <span className="collapsible-chevron" />
              </div>
              <div className="collapsible-content">
                {experiences.map((exp, i) => (
                  <div key={i} className="repeatable-row">
                    <div className="form-group"><label>Title</label><input type="text" value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} /></div>
                    <div className="form-group"><label>Organization</label><input type="text" value={exp.organization} onChange={(e) => updateExperience(i, 'organization', e.target.value)} /></div>
                    <div className="form-group" style={{ maxWidth: 120 }}>
                      <label>Type</label>
                      <select value={exp.type} onChange={(e) => updateExperience(i, 'type', e.target.value)}>
                        {EXPERIENCE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ maxWidth: 100 }}><label>Start</label><input type="text" value={exp.start} onChange={(e) => updateExperience(i, 'start', e.target.value)} /></div>
                    <div className="form-group" style={{ maxWidth: 100 }}><label>End</label><input type="text" value={exp.end} onChange={(e) => updateExperience(i, 'end', e.target.value)} /></div>
                    <button type="button" className="btn-remove-row" onClick={() => removeExperience(i)}>&times;</button>
                  </div>
                ))}
                <button type="button" className="btn-add-row" onClick={addExperience}>+ Add Experience</button>
              </div>
            </div>

            <div className="form-actions">
              <button onClick={() => { setIsEditing(false); populateForm(politician) }} className="btn-secondary" disabled={saving}>Cancel</button>
              <button onClick={handleSave} className="btn-primary" disabled={saving || !fullName.trim() || !office || !state}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PoliticianDetailManage
