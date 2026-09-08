function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="panel-grid">
        <div className="panel">
          <div className="panel-label">Watchlist</div>
          <div className="panel-placeholder">No teams or players watched yet</div>
        </div>
        <div className="panel">
          <div className="panel-label">Recent Searches</div>
          <div className="panel-placeholder">Nothing searched yet</div>
        </div>
        <div className="panel">
          <div className="panel-label">Today</div>
          <div className="panel-placeholder">Game data coming soon</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
