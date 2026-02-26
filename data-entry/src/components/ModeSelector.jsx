import { Link } from 'react-router-dom'

function ModeSelector() {
  return (
    <div className="mode-selector">
      <h1>What would you like to do?</h1>
      <div className="mode-cards">
        <Link to="/add" className="mode-card">
          <div className="mode-icon">+</div>
          <h2>Add Stances</h2>
          <p>Fill in missing politician-issue combinations</p>
        </Link>
        <Link to="/review" className="mode-card">
          <div className="mode-icon">&#10003;</div>
          <h2>Review Stances</h2>
          <p>Vet entries from other volunteers</p>
        </Link>
        <Link to="/manage" className="mode-card">
          <div className="mode-icon">&#9998;</div>
          <h2>Manage Politicians</h2>
          <p>Add new or edit existing politicians</p>
        </Link>
        <Link to="/review/politicians" className="mode-card">
          <div className="mode-icon">&#128100;</div>
          <h2>Review Politicians</h2>
          <p>Vet politician entries from other volunteers</p>
        </Link>
        <Link to="/buildings" className="mode-card">
          <div className="mode-icon">&#127963;</div>
          <h2>Building Photos</h2>
          <p>Add government building photos for local jurisdictions</p>
        </Link>
        <Link to="/buildings/review" className="mode-card">
          <div className="mode-icon">&#128444;</div>
          <h2>Review Building Photos</h2>
          <p>Vet building photos submitted by other volunteers</p>
        </Link>
      </div>
    </div>
  )
}

export default ModeSelector
