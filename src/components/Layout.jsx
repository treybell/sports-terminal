import { Outlet } from 'react-router-dom'
import CommandBar from './CommandBar.jsx'
import Sidebar from './Sidebar.jsx'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <CommandBar />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
