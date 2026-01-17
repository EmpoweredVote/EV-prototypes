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
          <p>Add new politicians or view existing</p>
        </Link>
      </div>
    </div>
  )
}

export default ModeSelector
