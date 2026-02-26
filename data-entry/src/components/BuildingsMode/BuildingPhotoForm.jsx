import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { createBuildingPhoto, submitBuildingPhotoForReview, adminApproveBuildingPhoto } from '../../api/backend'
import { useAuth } from '../../context/AuthContext'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const STORAGE_BUCKET = 'building-photos'

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

const LICENSE_OPTIONS = [
  { value: 'public_domain', label: 'Public Domain' },
  { value: 'cc0', label: 'CC0 (No Rights Reserved)' },
  { value: 'cc_by', label: 'CC BY (Attribution)' },
  { value: 'cc_by_sa', label: 'CC BY-SA (Attribution-ShareAlike)' },
  { value: 'cc_by_nc', label: 'CC BY-NC (Attribution-NonCommercial)' },
  { value: 'cc_by_nc_sa', label: 'CC BY-NC-SA' },
  { value: 'fair_use', label: 'Fair Use' },
  { value: 'government_work', label: 'U.S. Government Work' },
  { value: 'press_use', label: 'Press Use' },
  { value: 'other', label: 'Other' },
]

function BuildingPhotoForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const geoId = searchParams.get('geo_id') || ''
  const placeName = searchParams.get('name') || ''
  const state = searchParams.get('state') || ''

  const [form, setForm] = useState({
    place_geoid: geoId,
    place_name: placeName,
    state: state,
    source_url: '',
    license: '',
    attribution: '',
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB')
      return
    }

    setFile(selected)
    setError(null)

    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(selected)
  }

  async function handleSubmit(e, autoSubmit = false) {
    e.preventDefault()
    setError(null)

    if (!file) {
      setError('Please select a photo')
      return
    }

    if (!form.place_geoid || !form.place_name || !form.license || !form.attribution) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setUploading(true)

      // Upload to Supabase Storage
      let photoUrl = ''
      if (supabase) {
        const ext = file.name.split('.').pop()
        const path = `${form.state.toLowerCase()}/${form.place_geoid}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, { upsert: true })

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(path)

        photoUrl = urlData.publicUrl
      } else {
        setError('Supabase storage is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
        setUploading(false)
        return
      }

      setUploading(false)
      setSaving(true)

      // Create staging record
      const photo = await createBuildingPhoto({
        place_geoid: form.place_geoid,
        place_name: form.place_name,
        state: form.state,
        url: photoUrl,
        source_url: form.source_url || undefined,
        license: form.license,
        attribution: form.attribution,
      })

      // Auto-submit for review
      if (autoSubmit) {
        await submitBuildingPhotoForReview(photo.id)
        setSuccess('Photo uploaded and submitted for review!')
      } else {
        setSuccess('Photo saved as draft. You can submit it for review from the dashboard.')
      }

      setSaving(false)

      setTimeout(() => navigate('/buildings'), 2000)
    } catch (err) {
      setError(err.message)
      setUploading(false)
      setSaving(false)
    }
  }

  return (
    <div className="building-photo-form">
      <div className="page-header">
        <h1>Add Building Photo</h1>
        <p className="subtitle">
          {placeName ? `${placeName}, ${state}` : 'Upload a government building photo'}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={(e) => handleSubmit(e, true)} className="form-card">
        <div className="form-section">
          <h3>Jurisdiction</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Place Name *</label>
              <input
                type="text"
                value={form.place_name}
                onChange={e => setForm({ ...form, place_name: e.target.value })}
                placeholder="e.g., City of Springfield"
                required
              />
            </div>
            <div className="form-group form-group--small">
              <label>State *</label>
              <input
                type="text"
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                placeholder="e.g., IL"
                maxLength={2}
                required
              />
            </div>
            <div className="form-group form-group--small">
              <label>GeoID *</label>
              <input
                type="text"
                value={form.place_geoid}
                onChange={e => setForm({ ...form, place_geoid: e.target.value })}
                placeholder="e.g., 1770616"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Photo</h3>
          <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
            {preview ? (
              <img src={preview} alt="Preview" className="photo-preview" />
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">&#128247;</div>
                <p>Click to select a photo</p>
                <p className="upload-hint">JPG, PNG, or WebP - Max 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Licensing & Attribution</h3>
          <div className="form-group">
            <label>License *</label>
            <select
              value={form.license}
              onChange={e => setForm({ ...form, license: e.target.value })}
              required
            >
              <option value="">Select a license...</option>
              {LICENSE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Attribution / Credit *</label>
            <input
              type="text"
              value={form.attribution}
              onChange={e => setForm({ ...form, attribution: e.target.value })}
              placeholder="e.g., Photo by John Doe / Wikimedia Commons"
              required
            />
          </div>
          <div className="form-group">
            <label>Source URL</label>
            <input
              type="url"
              value={form.source_url}
              onChange={e => setForm({ ...form, source_url: e.target.value })}
              placeholder="e.g., https://commons.wikimedia.org/wiki/File:..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/buildings')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="btn btn-secondary"
            disabled={uploading || saving}
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || saving}
          >
            {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BuildingPhotoForm
