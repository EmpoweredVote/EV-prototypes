import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { addPolitician } from '../../api/sheets'
import { useVolunteer } from '../../context/VolunteerContext'

const PARTIES = [
  'Democrat',
  'Republican',
  'Independent',
  'Libertarian',
  'Green',
  'Unknown',
  'Other'
]

const OFFICE_LEVELS = [
  { value: 'federal', label: 'Federal' },
  { value: 'state', label: 'State' },
  { value: 'municipal', label: 'Municipal' },
  { value: 'school_district', label: 'School District' }
]

function AddPoliticianForm() {
  const navigate = useNavigate()
  const { volunteerName } = useVolunteer()

  const [fullName, setFullName] = useState('')
  const [party, setParty] = useState('')
  const [customParty, setCustomParty] = useState('')
  const [office, setOffice] = useState('')
  const [officeLevel, setOfficeLevel] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }

    const finalParty = party === 'Other' ? customParty : party

    try {
      setSaving(true)
      setError(null)

      await addPolitician({
        full_name: fullName.trim(),
        party: finalParty,
        office: office.trim(),
        office_level: officeLevel,
        added_by: volunteerName
      })

      navigate('/manage')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

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
          <label htmlFor="office">Office</label>
          <input
            type="text"
            id="office"
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            placeholder="e.g., U.S. Senator, Governor, Mayor"
          />
        </div>

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

        <div className="form-actions">
          <Link to="/manage" className="btn-secondary">Cancel</Link>
          <button
            type="submit"
            disabled={saving || !fullName.trim()}
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
