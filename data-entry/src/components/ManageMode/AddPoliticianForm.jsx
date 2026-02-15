import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addPolitician } from '../../api/sheets'

const PARTIES = [
  'Democrat',
  'Republican',
  'Independent',
  'Libertarian',
  'Green',
  'Unknown',
  'Other'
]

const OFFICES = [
  { value: 'US President', label: 'US President', level: 'federal' },
  { value: 'US Senate', label: 'US Senate', level: 'federal' },
  { value: 'US House', label: 'US House', level: 'federal' },
  { value: 'Governor', label: 'Governor', level: 'state' },
  { value: 'State Senate', label: 'State Senate', level: 'state' },
  { value: 'State House', label: 'State House/Assembly', level: 'state' },
  { value: 'Mayor', label: 'Mayor', level: 'municipal' },
  { value: 'City Council', label: 'City Council', level: 'municipal' },
  { value: 'School Board', label: 'School Board', level: 'school_district' },
  { value: 'Other', label: 'Other', level: '' }
]

const OFFICE_LEVELS = [
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'State' },
  { value: 'municipal', label: 'Municipal' },
  { value: 'school_district', label: 'School District' }
]

const STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'Washington D.C.' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'National', label: 'National (for US President)' }
]

const CONTACT_TYPES = ['phone', 'email', 'website', 'fax']
const EXPERIENCE_TYPES = ['work', 'office', 'military', 'other']

function AddPoliticianForm() {
  const navigate = useNavigate()

  // Mandatory fields
  const [fullName, setFullName] = useState('')
  const [party, setParty] = useState('')
  const [customParty, setCustomParty] = useState('')
  const [office, setOffice] = useState('')
  const [customOffice, setCustomOffice] = useState('')
  const [officeLevel, setOfficeLevel] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')

  // Optional biographical fields
  const [bioText, setBioText] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [contacts, setContacts] = useState([])
  const [degrees, setDegrees] = useState([])
  const [experiences, setExperiences] = useState([])

  // Collapsible section state
  const [openSections, setOpenSections] = useState({})

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // When office changes, auto-set the office level
  const handleOfficeChange = (newOffice) => {
    setOffice(newOffice)
    const selectedOffice = OFFICES.find(o => o.value === newOffice)
    if (selectedOffice && selectedOffice.level) {
      setOfficeLevel(selectedOffice.level)
    } else {
      setOfficeLevel('')
    }
  }

  // Contact helpers
  const addContact = () => setContacts([...contacts, { type: 'phone', value: '' }])
  const removeContact = (i) => setContacts(contacts.filter((_, idx) => idx !== i))
  const updateContact = (i, field, value) => {
    const updated = [...contacts]
    updated[i] = { ...updated[i], [field]: value }
    setContacts(updated)
  }

  // Degree helpers
  const addDegree = () => setDegrees([...degrees, { degree: '', major: '', school: '', grad_year: '' }])
  const removeDegree = (i) => setDegrees(degrees.filter((_, idx) => idx !== i))
  const updateDegree = (i, field, value) => {
    const updated = [...degrees]
    updated[i] = { ...updated[i], [field]: value }
    setDegrees(updated)
  }

  // Experience helpers
  const addExperience = () => setExperiences([...experiences, { title: '', organization: '', type: 'work', start: '', end: '' }])
  const removeExperience = (i) => setExperiences(experiences.filter((_, idx) => idx !== i))
  const updateExperience = (i, field, value) => {
    const updated = [...experiences]
    updated[i] = { ...updated[i], [field]: value }
    setExperiences(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }

    if (!office) {
      setError('Office is required')
      return
    }

    if (!state) {
      setError('State is required')
      return
    }

    const finalParty = party === 'Other' ? customParty : party
    const finalOffice = office === 'Other' ? customOffice : office

    // Filter out empty optional entries
    const validContacts = contacts.filter(c => c.value.trim())
    const validDegrees = degrees.filter(d => d.school.trim() || d.degree.trim())
    const validExperiences = experiences.filter(x => x.title.trim() || x.organization.trim())

    try {
      setSaving(true)
      setError(null)

      await addPolitician({
        full_name: fullName.trim(),
        party: finalParty,
        office: finalOffice,
        office_level: officeLevel,
        state: state,
        district: district.trim(),
        bio_text: bioText.trim() || undefined,
        photo_url: photoURL.trim() || undefined,
        contacts: validContacts.length > 0 ? validContacts : undefined,
        degrees: validDegrees.length > 0 ? validDegrees : undefined,
        experiences: validExperiences.length > 0 ? validExperiences : undefined,
      })

      navigate('/manage')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Determine if district field should show based on office type
  const showDistrictField = office && !['US President', 'Governor', 'US Senate'].includes(office)

  // Show office level dropdown only for "Other" office
  const showOfficeLevelField = office === 'Other'

  return (
    <div className="add-politician-form">
      <div className="page-header">
        <h1>Add Politician</h1>
        <Link to="/manage" className="btn-secondary">Back to List</Link>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., John Smith"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="party">Party</label>
          <select
            id="party"
            value={party}
            onChange={(e) => setParty(e.target.value)}
          >
            <option value="">Select a party...</option>
            {PARTIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {party === 'Other' && (
          <div className="form-group">
            <label htmlFor="customParty">Custom Party Name</label>
            <input
              type="text"
              id="customParty"
              value={customParty}
              onChange={(e) => setCustomParty(e.target.value)}
              placeholder="Enter party name"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="office">Office *</label>
          <select
            id="office"
            value={office}
            onChange={(e) => handleOfficeChange(e.target.value)}
            required
          >
            <option value="">Select an office...</option>
            {OFFICES.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {office === 'Other' && (
          <div className="form-group">
            <label htmlFor="customOffice">Custom Office Name</label>
            <input
              type="text"
              id="customOffice"
              value={customOffice}
              onChange={(e) => setCustomOffice(e.target.value)}
              placeholder="Enter office name"
            />
          </div>
        )}

        {showOfficeLevelField && (
          <div className="form-group">
            <label htmlFor="officeLevel">Office Level</label>
            <select
              id="officeLevel"
              value={officeLevel}
              onChange={(e) => setOfficeLevel(e.target.value)}
            >
              <option value="">Select a level...</option>
              {OFFICE_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="state">State *</label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <option value="">Select a state...</option>
            {STATES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {showDistrictField && (
          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              type="text"
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g., 12, District 5, Ward 3, At-Large"
            />
            <span className="form-hint">Leave blank if not applicable</span>
          </div>
        )}

        {/* Optional: Bio & Photo */}
        <div className={`collapsible-section ${openSections.bio ? 'open' : ''}`}>
          <div className="collapsible-header" onClick={() => toggleSection('bio')}>
            <span>+ Bio & Photo</span>
            <span className="collapsible-chevron" />
          </div>
          <div className="collapsible-content">
            <div className="form-group">
              <label htmlFor="bioText">Biography</label>
              <textarea
                id="bioText"
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Brief biography or description..."
                rows={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="photoURL">Photo URL</label>
              <input
                type="url"
                id="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
        </div>

        {/* Optional: Contact Info */}
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
                  <select
                    value={contact.type}
                    onChange={(e) => updateContact(i, 'type', e.target.value)}
                  >
                    {CONTACT_TYPES.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Value</label>
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => updateContact(i, 'value', e.target.value)}
                    placeholder={contact.type === 'email' ? 'name@example.com' : contact.type === 'phone' ? '(555) 123-4567' : 'https://...'}
                  />
                </div>
                <button type="button" className="btn-remove-row" onClick={() => removeContact(i)}>&times;</button>
              </div>
            ))}
            <button type="button" className="btn-add-row" onClick={addContact}>+ Add Contact</button>
          </div>
        </div>

        {/* Optional: Education */}
        <div className={`collapsible-section ${openSections.degrees ? 'open' : ''}`}>
          <div className="collapsible-header" onClick={() => toggleSection('degrees')}>
            <span>+ Education</span>
            <span className="collapsible-chevron" />
          </div>
          <div className="collapsible-content">
            {degrees.map((deg, i) => (
              <div key={i} className="repeatable-row">
                <div className="form-group">
                  <label>Degree</label>
                  <input
                    type="text"
                    value={deg.degree}
                    onChange={(e) => updateDegree(i, 'degree', e.target.value)}
                    placeholder="e.g., B.A."
                  />
                </div>
                <div className="form-group">
                  <label>Major</label>
                  <input
                    type="text"
                    value={deg.major}
                    onChange={(e) => updateDegree(i, 'major', e.target.value)}
                    placeholder="e.g., Political Science"
                  />
                </div>
                <div className="form-group">
                  <label>School</label>
                  <input
                    type="text"
                    value={deg.school}
                    onChange={(e) => updateDegree(i, 'school', e.target.value)}
                    placeholder="e.g., Harvard University"
                  />
                </div>
                <div className="form-group" style={{ maxWidth: 100 }}>
                  <label>Year</label>
                  <input
                    type="text"
                    value={deg.grad_year}
                    onChange={(e) => updateDegree(i, 'grad_year', e.target.value)}
                    placeholder="2005"
                  />
                </div>
                <button type="button" className="btn-remove-row" onClick={() => removeDegree(i)}>&times;</button>
              </div>
            ))}
            <button type="button" className="btn-add-row" onClick={addDegree}>+ Add Degree</button>
          </div>
        </div>

        {/* Optional: Work Experience */}
        <div className={`collapsible-section ${openSections.experiences ? 'open' : ''}`}>
          <div className="collapsible-header" onClick={() => toggleSection('experiences')}>
            <span>+ Work Experience</span>
            <span className="collapsible-chevron" />
          </div>
          <div className="collapsible-content">
            {experiences.map((exp, i) => (
              <div key={i} className="repeatable-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(i, 'title', e.target.value)}
                    placeholder="e.g., Attorney"
                  />
                </div>
                <div className="form-group">
                  <label>Organization</label>
                  <input
                    type="text"
                    value={exp.organization}
                    onChange={(e) => updateExperience(i, 'organization', e.target.value)}
                    placeholder="e.g., Smith & Associates"
                  />
                </div>
                <div className="form-group" style={{ maxWidth: 120 }}>
                  <label>Type</label>
                  <select
                    value={exp.type}
                    onChange={(e) => updateExperience(i, 'type', e.target.value)}
                  >
                    {EXPERIENCE_TYPES.map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ maxWidth: 100 }}>
                  <label>Start</label>
                  <input
                    type="text"
                    value={exp.start}
                    onChange={(e) => updateExperience(i, 'start', e.target.value)}
                    placeholder="2010"
                  />
                </div>
                <div className="form-group" style={{ maxWidth: 100 }}>
                  <label>End</label>
                  <input
                    type="text"
                    value={exp.end}
                    onChange={(e) => updateExperience(i, 'end', e.target.value)}
                    placeholder="Present"
                  />
                </div>
                <button type="button" className="btn-remove-row" onClick={() => removeExperience(i)}>&times;</button>
              </div>
            ))}
            <button type="button" className="btn-add-row" onClick={addExperience}>+ Add Experience</button>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/manage" className="btn-secondary">Cancel</Link>
          <button
            type="submit"
            disabled={saving || !fullName.trim() || !office || !state}
            className="btn-primary"
          >
            {saving ? 'Adding...' : 'Add Politician'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPoliticianForm
