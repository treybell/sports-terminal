import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlayer } from '../api.js'

function PlayerProfile({ id }) {
  const [player, setPlayer] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    setPlayer(null)
    getPlayer(id)
      .then((data) => {
        setPlayer(data)
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [id])

  if (status === 'loading') {
    return <div className="panel-placeholder">Loading player...</div>
  }

  if (status === 'error' || !player) {
    return <div className="panel-placeholder">Couldn't load this player.</div>
  }

  const hasStats = player.points_per_game != null

  return (
    <div>
      <h1 className="page-title">{player.full_name}</h1>
      <div className="panel-grid">
        <div className="panel">
          <div className="panel-label">Position</div>
          <div>{player.position ?? '-'}</div>
        </div>
        <div className="panel">
          <div className="panel-label">Team</div>
          <div>
            {player.team ? (
              <Link to={`/teams/${player.team.id}`}>
                {player.team.full_name}
              </Link>
            ) : (
              'Unassigned'
            )}
          </div>
        </div>
        <div className="panel">
          <div className="panel-label">Status</div>
          <div>{player.is_active ? 'Active' : 'Retired'}</div>
        </div>
      </div>

      <h2 className="page-title section-gap">Current Season</h2>
      {hasStats ? (
        <div className="panel-grid">
          <div className="panel">
            <div className="panel-label">PPG</div>
            <div>{player.points_per_game}</div>
          </div>
          <div className="panel">
            <div className="panel-label">RPG</div>
            <div>{player.rebounds_per_game}</div>
          </div>
          <div className="panel">
            <div className="panel-label">APG</div>
            <div>{player.assists_per_game}</div>
          </div>
        </div>
      ) : (
        <div className="panel-placeholder">
          No current-season stats available.
        </div>
      )}
    </div>
  )
}

export default PlayerProfile
