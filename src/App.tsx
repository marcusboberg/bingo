import { useEffect, useMemo, useState } from 'react'
import './App.css'
import GameBoard from './components/GameBoard'
import MenuOverlay from './components/MenuOverlay'
import UserPicker from './components/UserPicker'
import { loadState, saveState } from './db'
import { TICKETS } from './tickets'
import type { AppState, Player } from './types'

const players: Player[] = ['Marcus', 'Philip']
const GAME_INDICES: AppState['activeGameIndex'][] = [0, 1, 2, 3, 4]

function createEmptyMarks(): AppState['marks'] {
  return players.reduce(
    (acc, player) => {
      const ticket = TICKETS[player]
      acc[player] = ticket.games.map((game) =>
        game.map((block) =>
          block.map((row) =>
            row.map(() => false),
          ),
        ),
      )
      return acc
    },
    {} as AppState['marks'],
  )
}

function normalizeState(state?: Partial<AppState>): AppState {
  const baseMarks = createEmptyMarks()
  const activeUser: Player = state?.activeUser === 'Philip' ? 'Philip' : 'Marcus'
  const activeGameIndex = GAME_INDICES.includes(state?.activeGameIndex as AppState['activeGameIndex'])
    ? (state!.activeGameIndex as AppState['activeGameIndex'])
    : 0

  const normalizedMarks: AppState['marks'] = { ...baseMarks }

  players.forEach((player) => {
    normalizedMarks[player] = baseMarks[player].map((game, gIdx) => {
      const gameMarks = (state?.marks as AppState['marks'] | undefined)?.[player]?.[gIdx]
      if (!Array.isArray(gameMarks)) return game

      return game.map((block, bIdx) => {
        const blockMarks = gameMarks?.[bIdx]
        return block.map((row, rIdx) => {
          const rowMarks = blockMarks?.[rIdx]
          return row.map((_, cIdx) => Boolean(rowMarks?.[cIdx]))
        })
      })
    })
  })

  return {
    activeUser,
    activeGameIndex,
    marks: normalizedMarks,
  }
}

function createInitialState(): AppState {
  return normalizeState({
    activeUser: 'Marcus',
    activeGameIndex: 0,
    marks: createEmptyMarks(),
  })
}

function App() {
  const [state, setState] = useState<AppState | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showUserPicker, setShowUserPicker] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const saved = await loadState()
      if (!mounted) return
      if (saved) {
        setState(normalizeState(saved))
        setShowUserPicker(false)
      } else {
        setState(createInitialState())
        setShowUserPicker(true)
      }
      setLoading(false)
    })()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!state) return
    const timer = window.setTimeout(() => {
      saveState(state).catch((error) => console.error('Could not persist state', error))
    }, 200)
    return () => window.clearTimeout(timer)
  }, [state])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  const activeTicket = state ? TICKETS[state.activeUser] : null
  const activeGame = useMemo(() => {
    if (!state || !activeTicket) return null
    return activeTicket.games[state.activeGameIndex]
  }, [state, activeTicket])

  const activeMarks = useMemo<boolean[][][]>(() => {
    if (!state) return []
    return (state.marks[state.activeUser]?.[state.activeGameIndex] ?? []) as boolean[][][]
  }, [state])

  const handleUserSelect = (user: Player) => {
    setState((prev) => {
      const base = prev ?? createInitialState()
      return { ...base, activeUser: user }
    })
    setShowUserPicker(false)
    setShowMenu(false)
  }

  const handleGameSelect = (index: number) => {
    if (!GAME_INDICES.includes(index as AppState['activeGameIndex'])) return
    setState((prev) => (prev ? { ...prev, activeGameIndex: index as AppState['activeGameIndex'] } : prev))
    setShowMenu(false)
  }

  const toggleCell = (blockIndex: number, rowIndex: number, colIndex: number) => {
    setState((prev) => {
      if (!prev) return prev
      const user = prev.activeUser
      const userMarks = prev.marks[user] ?? createEmptyMarks()[user]

      const updated = userMarks.map((game, gIdx) => {
        if (gIdx !== prev.activeGameIndex) return game
        return game.map((block, bIdx) => {
          if (bIdx !== blockIndex) return block
          return block.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row
            return row.map((cell, cIdx) => (cIdx === colIndex ? !cell : cell))
          })
        })
      })

      return {
        ...prev,
        marks: {
          ...prev.marks,
          [user]: updated,
        },
      }
    })
  }

  const handleExport = async () => {
    if (!state) return
    try {
      const data = JSON.stringify(state)
      await navigator.clipboard.writeText(data)
      setToast('State kopierad till clipboard')
    } catch (error) {
      console.error(error)
      setToast('Kunde inte kopiera')
    }
  }

  const handleImport = async (text: string) => {
    try {
      const parsed = JSON.parse(text)
      const normalized = normalizeState(parsed)
      setState(normalized)
      setShowUserPicker(false)
      setShowMenu(false)
      setToast('State importerat')
    } catch (error) {
      console.error(error)
      setToast('Ogiltig JSON')
    }
  }

  if (loading || !state || !activeTicket || !activeGame) {
    return (
      <div className="app-shell">
        <div className="loading">Laddar...</div>
      </div>
    )
  }

  if (showUserPicker) {
    return (
      <div className="app-shell">
        <UserPicker onSelect={handleUserSelect} />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="app-card">
        <header className="ticket-meta">
          <div className="pill user-pill">{state.activeUser}</div>
          <div className="meta-line">
            <span className="meta-label">Serie</span>
            <span className="meta-value">{activeTicket.series}</span>
          </div>
          <div className="meta-line">
            <span className="meta-label">Lott</span>
            <span className="meta-value">{activeTicket.ticketNumber}</span>
          </div>
          <div className="meta-line emphasis">
            <span className="meta-label">Spel</span>
            <span className="meta-value">{state.activeGameIndex + 1} / 5</span>
          </div>
        </header>

        <main className="ticket-body">
          <GameBoard game={activeGame} marks={activeMarks} onToggle={toggleCell} />
        </main>
      </div>

      <button type="button" className="floating-button" onClick={() => setShowMenu(true)} aria-label="Öppna meny">
        ☰
      </button>

      {showMenu && (
        <MenuOverlay
          activeUser={state.activeUser}
          activeGameIndex={state.activeGameIndex}
          onSelectUser={handleUserSelect}
          onSelectGame={handleGameSelect}
          onClose={() => setShowMenu(false)}
          onExportState={handleExport}
          onImportState={handleImport}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
