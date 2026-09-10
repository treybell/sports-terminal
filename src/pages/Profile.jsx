import { useParams } from 'react-router-dom'
import PlayerProfile from './PlayerProfile.jsx'
import TeamProfile from './TeamProfile.jsx'

function Profile() {
  const { type, id } = useParams()
  return type === 'teams' ? <TeamProfile id={id} /> : <PlayerProfile id={id} />
}

export default Profile
