import { useState } from 'react'
import { useVolunteer } from '../context/VolunteerContext'

function VolunteerLogin() {
  const [name, setName] = useState('')
  const { login } = useVolunteer()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      login(name)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Politician Stance Data Entry</h1>
        <p>Enter your name to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            required
          />
          <button type="submit" disabled={!name.trim()}>
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default VolunteerLogin
