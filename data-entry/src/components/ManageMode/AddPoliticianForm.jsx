import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { addPolitician, updatePolitician } from '../../api/sheets'
import {
  PARTIES, OFFICES, OFFICE_LEVELS, STATES,
  CONTACT_TYPES, EXPERIENCE_TYPES, DISTRICT_TYPES, PARTISAN_TYPES
} from './politicianConstants'

function AddPoliticianForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = location.state?.prefill || null

  // Helper to determine initial office/party from prefill
  const initVal = (val, list, isOffice) => {
    if (!val) return { main: '', custom: '' }
    if (isOffice) {
      const known = list.find(o => o.value === val)
      return known ? { main: val, custom: '' } : { main: 'Other', custom: val }
    }
    return list.includes(val) ? { main: val, custom: '' } : { main: 'Other', custom: val }
  }
  const officeInit = initVal(prefill?.office, OFFICES, true)
  const partyInit = initVal(prefill?.party, PARTIES, false)

  // Core fields
  const [fullName, setFullName] = useState(prefill?.full_name || '')
  const [party, setParty] = useState(partyInit.main)
  const [customParty, setCustomParty] = useState(partyInit.custom)
  const [office, setOffice] = useState(officeInit.main)
  const [customOffice, setCustomOffice] = useState(officeInit.custom)
  const [officeLevel, setOfficeLevel] = useState(prefill?.office_level || '')
  const [state, setState] = useState(prefill?.state || '')
  const [district, setDistrict] = useState(prefill?.district || '')

  // Bio & Photo
  const [bioText, setBioText] = useState(prefill?.bio_text || '')
  const [photoURL, setPhotoURL] = useState(prefill?.photo_url || '')

  // Repeatable arrays
  const [contacts, setContacts] = useState(prefill?.contacts || [])
  const [degrees, setDegrees] = useState(prefill?.degrees || [])
  const [experiences, setExperiences] = useState(prefill?.experiences || [])
  const [urls, setUrls] = useState(prefill?.urls || [])
  const [images, setImages] = useState(prefill?.images || [])
  const [addresses, setAddresses] = useState(prefill?.addresses || [])

  // Term & Status
  const [validFrom, setValidFrom] = useState(prefill?.valid_from || '')
  const [validTo, setValidTo] = useState(prefill?.valid_to || '')
  const [totalYears, setTotalYears] = useState(prefill?.total_years_in_office || '')
  const [isAppointed, setIsAppointed] = useState(prefill?.is_appointed || false)
  const [isVacant, setIsVacant] = useState(prefill?.is_vacant || false)
  const [electionFrequency, setElectionFrequency] = useState(prefill?.election_frequency || '')

  // Office Details
  const [officeDescription, setOfficeDescription] = useState(prefill?.office_description || '')
  const [officeSeats, setOfficeSeats] = useState(prefill?.office_seats || '')
  const [partisanType, setPartisanType] = useState(prefill?.partisan_type || '')
  const [salary, setSalary] = useState(prefill?.salary || '')
  const [chamberName, setChamberName] = useState(prefill?.chamber_name || '')

  // District/Geo
  const [districtType, setDistrictType] = useState(prefill?.district_type || '')
  const [districtOCDID, setDistrictOCDID] = useState(prefill?.district_ocd_id || '')
  const [districtGeoID, setDistrictGeoID] = useState(prefill?.district_geo_id || '')

  // Collapsible sections
  const [openSections, setOpenSections] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

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

  // Array helpers
  const addContact = () => setContacts([...contacts, { type: 'phone', value: '' }])
  const removeContact = (i) => setContacts(contacts.filter((_, idx) => idx !== i))
  const updateContact = (i, field, value) => { const u = [...contacts]; u[i] = { ...u[i], [field]: value }; setContacts(u) }

  const addDegree = () => setDegrees([...degrees, { degree: '', major: '', school: '', grad_year: '' }])
  const removeDegree = (i) => setDegrees(degrees.filter((_, idx) => idx !== i))
  const updateDegree = (i, field, value) => { const u = [...degrees]; u[i] = { ...u[i], [field]: value }; setDegrees(u) }

  const addExperience = () => setExperiences([...experiences, { title: '', organization: '', type: 'work', start: '', end: '' }])
  const removeExperience = (i) => setExperiences(experiences.filter((_, idx) => idx !== i))
  const updateExperience = (i, field, value) => { const u = [...experiences]; u[i] = { ...u[i], [field]: value }; setExperiences(u) }

  const addUrl = () => setUrls([...urls, ''])
  const removeUrl = (i) => setUrls(urls.filter((_, idx) => idx !== i))
  const updateUrl = (i, value) => { const u = [...urls]; u[i] = value; setUrls(u) }

  const addImage = () => setImages([...images, { url: '', type: 'default' }])
  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i))
  const updateImage = (i, field, value) => { const u = [...images]; u[i] = { ...u[i], [field]: value }; setImages(u) }

  const addAddress = () => setAddresses([...addresses, { address_1: '', address_2: '', state: '', postal_code: '', phone_1: '', phone_2: '' }])
  const removeAddress = (i) => setAddresses(addresses.filter((_, idx) => idx !== i))
  const updateAddress = (i, field, value) => { const u = [...addresses]; u[i] = { ...u[i], [field]: value }; setAddresses(u) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) { setError('Full name is required'); return }
    if (!office) { setError('Office is required'); return }
    if (!state) { setError('State is required'); return }

    const finalParty = party === 'Other' ? customParty : party
    const finalOffice = office === 'Other' ? customOffice : office
    const validContacts = contacts.filter(c => c.value && c.value.trim())
    const validDegrees = degrees.filter(d => (d.school && d.school.trim()) || (d.degree && d.degree.trim()))
    const validExperiences = experiences.filter(x => (x.title && x.title.trim()) || (x.organization && x.organization.trim()))
    const validUrls = urls.filter(u => u && u.trim())
    const validImages = images.filter(img => img.url && img.url.trim())
    const validAddresses = addresses.filter(a => a.address_1 && a.address_1.trim())

    const data = {
      external_id: prefill?.external_id || undefined,
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
      urls: validUrls.length > 0 ? validUrls : undefined,
      images: validImages.length > 0 ? validImages : undefined,
      addresses: validAddresses.length > 0 ? validAddresses : undefined,
      valid_from: validFrom || undefined,
      valid_to: validTo || undefined,
      total_years_in_office: totalYears ? Number(totalYears) : undefined,
      office_description: officeDescription || undefined,
      office_seats: officeSeats ? Number(officeSeats) : undefined,
      partisan_type: partisanType || undefined,
      salary: salary || undefined,
      chamber_name: chamberName || undefined,
      district_type: districtType || undefined,
      district_ocd_id: districtOCDID || undefined,
      district_geo_id: districtGeoID || undefined,
      election_frequency: electionFrequency || undefined,
      is_appointed: isAppointed || undefined,
      is_vacant: isVacant || undefined,
    }

    try {
      setSaving(true)
      setError(null)

      if (prefill?.staging_id) {
        await updatePolitician(prefill.staging_id, data)
      } else {
        await addPolitician(data)
      }

      navigate('/manage')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const showDistrictField = office && !['US President', 'Governor', 'US Senate'].includes(office)
  const showOfficeLevelField = office === 'Other'

  const Section = ({ id, label, children }) => (
    <div className={`collapsible-section ${openSections[id] ? 'open' : ''}`}>
      <div className="collapsible-header" onClick={() => toggleSection(id)}>
        <span>+ {label}</span>
        <span className="collapsible-chevron" />
      </div>
      <div className="collapsible-content">{children}</div>
    </div>
  )

  return (
    <div className="add-politician-form">
      <div className="page-header">
        <h1>{prefill ? 'Edit Politician' : 'Add Politician'}</h1>
        <Link to="/manage" className="btn-secondary">Back to List</Link>
      </div>

      {prefill && !prefill.staging_id && (
        <div className="info-banner">
          Editing creates a new record that goes through community review before merging.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="form-content">
        {/* Core Fields */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., John Smith" required />
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
            <input type="text" id="customParty" value={customParty} onChange={(e) => setCustomParty(e.target.value)} placeholder="Enter party name" />
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
            <input type="text" id="customOffice" value={customOffice} onChange={(e) => setCustomOffice(e.target.value)} placeholder="Enter office name" />
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
            <input type="text" id="district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g., 12, District 5, Ward 3" />
          </div>
        )}

        {/* Term & Status */}
        <Section id="term" label="Term & Status">
          <div className="form-group"><label>Term Start</label><input type="text" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} placeholder="e.g., 2023-01-03" /></div>
          <div className="form-group"><label>Term End</label><input type="text" value={validTo} onChange={(e) => setValidTo(e.target.value)} placeholder="e.g., 2029-01-03" /></div>
          <div className="form-group"><label>Total Years in Office</label><input type="number" value={totalYears} onChange={(e) => setTotalYears(e.target.value)} /></div>
          <div className="form-group"><label>Election Frequency</label><input type="text" value={electionFrequency} onChange={(e) => setElectionFrequency(e.target.value)} placeholder="e.g., every 4 years" /></div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={isAppointed} onChange={(e) => setIsAppointed(e.target.checked)} /> Appointed
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={isVacant} onChange={(e) => setIsVacant(e.target.checked)} /> Vacant
            </label>
          </div>
        </Section>

        {/* Office Details */}
        <Section id="officeDetails" label="Office Details">
          <div className="form-group"><label>Office Description</label><textarea value={officeDescription} onChange={(e) => setOfficeDescription(e.target.value)} rows={2} /></div>
          <div className="form-group"><label>Seats</label><input type="number" value={officeSeats} onChange={(e) => setOfficeSeats(e.target.value)} /></div>
          <div className="form-group">
            <label>Partisan Type</label>
            <select value={partisanType} onChange={(e) => setPartisanType(e.target.value)}>
              <option value="">Select...</option>
              {PARTISAN_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Salary</label><input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} /></div>
          <div className="form-group"><label>Chamber Name</label><input type="text" value={chamberName} onChange={(e) => setChamberName(e.target.value)} /></div>
        </Section>

        {/* District & Geo */}
        <Section id="geo" label="District & Geo IDs">
          <div className="form-group">
            <label>District Type</label>
            <select value={districtType} onChange={(e) => setDistrictType(e.target.value)}>
              <option value="">Select...</option>
              {DISTRICT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-group"><label>OCD-ID</label><input type="text" value={districtOCDID} onChange={(e) => setDistrictOCDID(e.target.value)} placeholder="ocd-division/country:us/state:ca/..." /></div>
          <div className="form-group"><label>Geo ID</label><input type="text" value={districtGeoID} onChange={(e) => setDistrictGeoID(e.target.value)} /></div>
        </Section>

        {/* Bio & Photo */}
        <Section id="bio" label="Bio & Photo">
          <div className="form-group"><label>Biography</label><textarea value={bioText} onChange={(e) => setBioText(e.target.value)} rows={3} placeholder="Brief biography or description..." /></div>
          <div className="form-group"><label>Photo URL</label><input type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="https://example.com/photo.jpg" /></div>
        </Section>

        {/* URLs / Social Links */}
        <Section id="urls" label="URLs & Social Links">
          {urls.map((url, i) => (
            <div key={i} className="repeatable-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>URL</label>
                <input type="url" value={url} onChange={(e) => updateUrl(i, e.target.value)} placeholder="https://..." />
              </div>
              <button type="button" className="btn-remove-row" onClick={() => removeUrl(i)}>&times;</button>
            </div>
          ))}
          <button type="button" className="btn-add-row" onClick={addUrl}>+ Add URL</button>
        </Section>

        {/* Images */}
        <Section id="images" label="Images">
          {images.map((img, i) => (
            <div key={i} className="repeatable-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>URL</label>
                <input type="url" value={img.url} onChange={(e) => updateImage(i, 'url', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={img.type} onChange={(e) => updateImage(i, 'type', e.target.value)}>
                  <option value="default">Default</option>
                  <option value="thumb">Thumbnail</option>
                </select>
              </div>
              <button type="button" className="btn-remove-row" onClick={() => removeImage(i)}>&times;</button>
            </div>
          ))}
          <button type="button" className="btn-add-row" onClick={addImage}>+ Add Image</button>
        </Section>

        {/* Contact Info */}
        <Section id="contacts" label="Contact Info">
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
        </Section>

        {/* Addresses */}
        <Section id="addresses" label="Addresses">
          {addresses.map((addr, i) => (
            <div key={i} className="repeatable-row" style={{ flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '1 1 100%' }}><label>Address Line 1</label><input type="text" value={addr.address_1} onChange={(e) => updateAddress(i, 'address_1', e.target.value)} /></div>
              <div className="form-group" style={{ flex: '1 1 100%' }}><label>Address Line 2</label><input type="text" value={addr.address_2} onChange={(e) => updateAddress(i, 'address_2', e.target.value)} /></div>
              <div className="form-group"><label>State</label><input type="text" value={addr.state} onChange={(e) => updateAddress(i, 'state', e.target.value)} /></div>
              <div className="form-group"><label>Postal Code</label><input type="text" value={addr.postal_code} onChange={(e) => updateAddress(i, 'postal_code', e.target.value)} /></div>
              <div className="form-group"><label>Phone 1</label><input type="text" value={addr.phone_1} onChange={(e) => updateAddress(i, 'phone_1', e.target.value)} /></div>
              <div className="form-group"><label>Phone 2</label><input type="text" value={addr.phone_2} onChange={(e) => updateAddress(i, 'phone_2', e.target.value)} /></div>
              <button type="button" className="btn-remove-row" onClick={() => removeAddress(i)}>&times;</button>
            </div>
          ))}
          <button type="button" className="btn-add-row" onClick={addAddress}>+ Add Address</button>
        </Section>

        {/* Education */}
        <Section id="degrees" label="Education">
          {degrees.map((deg, i) => (
            <div key={i} className="repeatable-row">
              <div className="form-group"><label>Degree</label><input type="text" value={deg.degree} onChange={(e) => updateDegree(i, 'degree', e.target.value)} placeholder="e.g., B.A." /></div>
              <div className="form-group"><label>Major</label><input type="text" value={deg.major} onChange={(e) => updateDegree(i, 'major', e.target.value)} /></div>
              <div className="form-group"><label>School</label><input type="text" value={deg.school} onChange={(e) => updateDegree(i, 'school', e.target.value)} /></div>
              <div className="form-group" style={{ maxWidth: 100 }}><label>Year</label><input type="text" value={deg.grad_year} onChange={(e) => updateDegree(i, 'grad_year', e.target.value)} /></div>
              <button type="button" className="btn-remove-row" onClick={() => removeDegree(i)}>&times;</button>
            </div>
          ))}
          <button type="button" className="btn-add-row" onClick={addDegree}>+ Add Degree</button>
        </Section>

        {/* Work Experience */}
        <Section id="experiences" label="Work Experience">
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
        </Section>

        <div className="form-actions">
          <Link to="/manage" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving || !fullName.trim() || !office || !state} className="btn-primary">
            {saving ? 'Saving...' : (prefill ? 'Save Changes' : 'Add Politician')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPoliticianForm
