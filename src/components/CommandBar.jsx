import { useEffect, useState } from 'react'

function CommandBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="command-bar">
      <div className="command-bar-brand">SPORTS TERMINAL</div>
      <div className="command-bar-search">
        <span className="command-bar-prompt">&gt;</span>
        <input
          type="text"
          placeholder="Search players, teams, matchups..."
        />
      </div>
      <div className="command-bar-clock">
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </div>
    </header>
  )
}

export default CommandBar
