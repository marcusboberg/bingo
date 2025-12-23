import { useState } from 'react'
import type { Player } from '../types'

type Props = {
  activeUser: Player
  activeGameIndex: number
  onSelectUser: (user: Player) => void
  onSelectGame: (index: number) => void
  onClose: () => void
  onImportState?: (text: string) => Promise<void> | void
}

const users: Player[] = ['Marcus', 'Philip']

export function MenuOverlay({
  activeUser,
  activeGameIndex,
  onSelectUser,
  onSelectGame,
  onClose,
  onImportState,
}: Props) {
  const [importText, setImportText] = useState('')

  const handleImport = () => {
    if (!importText.trim()) return
    onImportState?.(importText.trim())
    setImportText('')
  }

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div className="menu-card" onClick={(e) => e.stopPropagation()}>
        <div className="menu-section">
          <div className="menu-label">Användare</div>
          <div className="chip-row">
            {users.map((user) => (
              <button
                key={user}
                type="button"
                className={`chip ${activeUser === user ? 'chip-active' : ''}`}
                onClick={() => onSelectUser(user)}
              >
                {user}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-label">Spel</div>
          <div className="chip-row">
            {[0, 1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                type="button"
                className={`chip ${activeGameIndex === idx ? 'chip-active' : ''}`}
                onClick={() => onSelectGame(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {onImportState && (
          <div className="menu-section subtle">
            <div className="menu-label">Importera state</div>
            <textarea
              className="import-area"
              placeholder='Klistra in JSON och tryck "Importera".'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button type="button" className="primary-button" onClick={handleImport}>
              Importera
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuOverlay
