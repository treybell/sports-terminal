import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PlayerSearch from './pages/PlayerSearch.jsx'
import TeamSearch from './pages/TeamSearch.jsx'
import Compare from './pages/Compare.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="players" element={<PlayerSearch />} />
        <Route path="teams" element={<TeamSearch />} />
        <Route path="compare" element={<Compare />} />
        <Route path=":type/:id" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
