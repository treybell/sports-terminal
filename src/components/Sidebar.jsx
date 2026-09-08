import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { key: '1', label: 'Dashboard', to: '/' },
  { key: '2', label: 'Players', to: '/players' },
  { key: '3', label: 'Teams', to: '/teams' },
  { key: '4', label: 'Compare', to: '/compare' },
]

function Sidebar() {
  return (
    <nav className="sidebar">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            'sidebar-link' + (isActive ? ' active' : '')
          }
        >
          <span className="sidebar-key">[{item.key}]</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default Sidebar
