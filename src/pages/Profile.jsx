import { useParams } from 'react-router-dom'

function Profile() {
  const { type, id } = useParams()

  return (
    <div>
      <h1 className="page-title">
        {type === 'teams' ? 'Team' : 'Player'} Profile
      </h1>
      <div className="panel-placeholder">
        Profile for ID "{id}" — real data wired up in Feature 6
      </div>
    </div>
  )
}

export default Profile
