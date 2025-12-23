import type { Player } from '../types'

type Props = {
  onSelect: (user: Player) => void
}

const users: Player[] = ['Marcus', 'Philip']

export function UserPicker({ onSelect }: Props) {
  return (
    <div className="user-picker">
      <h1 className="title">Bingos uppesittarkväll 2025</h1>
      <p className="subtitle">Välj vem som spelar</p>
      <div className="picker-buttons">
        {users.map((user) => (
          <button
            key={user}
            type="button"
            className="primary-button large"
            onClick={() => onSelect(user)}
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  )
}

export default UserPicker
