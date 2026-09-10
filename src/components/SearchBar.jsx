import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchPlayers, searchTeams } from '../api.js'

const DEBOUNCE_MS = 250
const MAX_RESULTS = 8

function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      setResults([])
      setStatus('idle')
      setIsOpen(false)
      return
    }

    setStatus('loading')

    const timeoutId = setTimeout(() => {
      Promise.all([searchTeams(trimmed), searchPlayers(trimmed)])
        .then(([teams, players]) => {
          const combined = [
            ...teams.map((t) => ({
              type: 'teams',
              id: t.id,
              label: t.full_name,
              sub: t.abbreviation,
            })),
            ...players.map((p) => ({
              type: 'players',
              id: p.id,
              label: p.full_name,
              sub: p.is_active ? 'Active' : 'Retired',
            })),
          ].slice(0, MAX_RESULTS)

          setResults(combined)
          setActiveIndex(combined.length ? 0 : -1)
          setStatus('done')
          setIsOpen(true)
        })
        .catch(() => {
          setResults([])
          setActiveIndex(-1)
          setStatus('error')
          setIsOpen(true)
        })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeoutId)
  }, [query])

  function selectResult(result) {
    if (!result) return
    navigate(`/${result.type}/${result.id}`)
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(event) {
    if (!isOpen || results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      selectResult(results[activeIndex])
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="search-bar">
      <span className="command-bar-prompt">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Search players, teams..."
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      />
      {isOpen && (
        <div className="search-results">
          {status === 'loading' && (
            <div className="search-status">Searching...</div>
          )}
          {status === 'error' && (
            <div className="search-status">
              Couldn't reach the backend — is it running?
            </div>
          )}
          {status === 'done' && results.length === 0 && (
            <div className="search-status">No results for "{query}"</div>
          )}
          {results.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              className={
                'search-result' + (index === activeIndex ? ' active' : '')
              }
              onMouseDown={() => selectResult(result)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="search-result-type">
                {result.type === 'teams' ? 'TEAM' : 'PLAYER'}
              </span>
              <span className="search-result-label">{result.label}</span>
              <span className="search-result-sub">{result.sub}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
