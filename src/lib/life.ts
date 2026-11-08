export const GRID_SIZE = 40
export type Board = Uint8Array

/** Conway B3/S23 on a toroidal grid: every edge connects to its opposite. */
export function evolveBoard(board: Board, size = GRID_SIZE): Board {
  const next = new Uint8Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let neighbors = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx || dy) neighbors += board[((y + dy + size) % size) * size + (x + dx + size) % size]
        }
      }
      const index = y * size + x
      next[index] = Number(neighbors === 3 || (board[index] === 1 && neighbors === 2))
    }
  }
  return next
}

/** A reproducible arrangement of small colonies, gliders and oscillators. */
export function createSeed(seed = 241): Board {
  const board = new Uint8Array(GRID_SIZE * GRID_SIZE)
  let randomState = seed >>> 0
  const random = () => {
    randomState = (randomState * 1664525 + 1013904223) >>> 0
    return randomState / 4294967296
  }
  for (let y = 6; y < GRID_SIZE - 6; y++) {
    for (let x = 6; x < GRID_SIZE - 6; x++) {
      const inBand = Math.abs(x - y) < 12
      if (inBand && random() < .29) board[y * GRID_SIZE + x] = 1
    }
  }
  const plant = (x: number, y: number, pattern: number[][]) => {
    pattern.forEach(([dx, dy]) => { board[((y + dy) % GRID_SIZE) * GRID_SIZE + (x + dx) % GRID_SIZE] = 1 })
  }
  plant(4, 4, [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]])
  plant(30, 7, [[0, 0], [1, 0], [2, 0]])
  plant(6, 28, [[0, 1], [1, 0], [1, 1], [1, 2], [2, 2]])
  plant(31, 29, [[0, 0], [1, 0], [0, 1], [1, 1]])
  return board
}
