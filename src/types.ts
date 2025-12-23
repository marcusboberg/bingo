export type Player = 'Marcus' | 'Philip'

export type Block = number[][] // 5 rows x 5 cols
export type Game = Block[] // 3 blocks per game

export type Ticket = {
  series: string
  ticketNumber: string
  games: Game[]
}

export type Tickets = Record<Player, Ticket>

export type Marks = Record<Player, boolean[][][][]> // [game][block][row][col]

export type AppState = {
  activeUser: Player
  activeGameIndex: 0 | 1 | 2 | 3 | 4
  marks: Marks
}
