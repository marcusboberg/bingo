import type { Game } from '../types'

type Props = {
  game: Game
  marks: boolean[][][]
  onToggle: (blockIndex: number, rowIndex: number, colIndex: number) => void
  winningCells?: Set<string>
}

const HEADERS = ['B', 'I', 'N', 'G', 'O']

export function GameBoard({ game, marks, onToggle, winningCells }: Props) {
  return (
    <div className="game-board">
      {game.map((block, blockIndex) => (
        <div className="block" key={blockIndex}>
          <div className="grid">
            {HEADERS.map((label) => (
              <div className="grid-header" key={label}>
                {label}
              </div>
            ))}
            {block.map((row, rowIndex) => {
              const blockMarks = marks?.[blockIndex] ?? []
              return row.map((value, colIndex) => {
                const isMarked = blockMarks?.[rowIndex]?.[colIndex] ?? false
                const isWinner = winningCells?.has(`${blockIndex}-${rowIndex}-${colIndex}`) ?? false
                return (
                  <button
                    type="button"
                    className={`cell ${isMarked ? 'marked' : ''} ${isWinner ? 'winner' : ''}`}
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => onToggle(blockIndex, rowIndex, colIndex)}
                  >
                    {value}
                  </button>
                )
              })
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameBoard
