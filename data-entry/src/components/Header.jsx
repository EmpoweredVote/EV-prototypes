import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useVolunteer } from '../context/VolunteerContext'

function Header() {
  const { volunteerName, changeName, logout } = useVolunteer()
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(volunteerName)
  const location = useLocation()

  const handleSaveName = () => {
    if (newName.trim()) {
      changeName(newName)
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      setNewName(volunteerName)
      setIsEditing(false)
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          Stance Data Entry
        </Link>
        {location.pathname !== '/' && (
          <Link to="/" className="back-link">
            Home
          </Link>
        )}
      </div>
      <div className="header-right">
        {isEditing ? (
          <div className="name-edit">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button onClick={handleSaveName} className="btn-small">Save</button>
            <button onClick={() => { setNewName(volunteerName); setIsEditing(false) }} className="btn-small btn-secondary">Cancel</button>
          </div>
        ) : (
          <div className="user-info">
            <span className="volunteer-name" onClick={() => setIsEditing(true)} title="Click to change name">
              {volunteerName}
            </span>
            <button onClick={logout} className="btn-small btn-secondary">Logout</button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
