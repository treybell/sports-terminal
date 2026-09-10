import { useEffect, useState } from 'react'
import SearchBar from './SearchBar.jsx'

function CommandBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="command-bar">
      <div className="command-bar-brand">SPORTS TERMINAL</div>
      <SearchBar />
      <div className="command-bar-clock">
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </div>
    </header>
  )
}

export default CommandBar
