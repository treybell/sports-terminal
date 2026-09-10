import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeam } from '../api.js'

function TeamProfile({ id }) {
  const [team, setTeam] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    setTeam(null)
    getTeam(id)
      .then((data) => {
        setTeam(data)
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [id])

  if (status === 'loading') {
    return <div className="panel-placeholder">Loading team...</div>
  }

  if (status === 'error' || !team) {
    return <div className="panel-placeholder">Couldn't load this team.</div>
  }

  return (
    <div>
      <h1 className="page-title">{team.full_name}</h1>
      <div className="panel-grid">
        <div className="panel">
          <div className="panel-label">Record</div>
          <div>
            {team.wins ?? '-'} - {team.losses ?? '-'}
          </div>
        </div>
        <div className="panel">
          <div className="panel-label">Founded</div>
          <div>{team.year_founded ?? '-'}</div>
        </div>
        <div className="panel">
          <div className="panel-label">City</div>
          <div>
            {team.city}, {team.state}
          </div>
        </div>
      </div>

      <h2 className="page-title section-gap">Roster</h2>
      <div className="roster-list">
        {team.roster.length === 0 && (
          <div className="panel-placeholder">
            No roster data synced for this team yet.
          </div>
        )}
        {team.roster.map((player) => (
          <Link
            key={player.id}
            to={`/players/${player.id}`}
            className="roster-row"
          >
            <span>{player.full_name}</span>
            <span className="roster-position">{player.position ?? '-'}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TeamProfile
