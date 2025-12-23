import { openDB } from 'idb'
import type { AppState } from './types'

const DB_NAME = 'bingo-db'
const STORE_NAME = 'state'
const STATE_KEY = 'bingo_state_v1'

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
}

export async function loadState(): Promise<AppState | undefined> {
  const db = await getDb()
  return db.get(STORE_NAME, STATE_KEY)
}

export async function saveState(state: AppState) {
  const db = await getDb()
  await db.put(STORE_NAME, state, STATE_KEY)
}
