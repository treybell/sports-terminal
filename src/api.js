const API_BASE = 'http://localhost:8000'

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`)
  }
  return res.json()
}

export function searchTeams(query) {
  return get(`/teams?search=${encodeURIComponent(query)}`)
}

export function searchPlayers(query) {
  return get(`/players?search=${encodeURIComponent(query)}`)
}

export function getTeam(id) {
  return get(`/teams/${id}`)
}

export function getPlayer(id) {
  return get(`/players/${id}`)
}
