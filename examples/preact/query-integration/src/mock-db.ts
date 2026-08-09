export async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export interface StoredUser {
  firstName: string
  lastName: string
}

class DB {
  private data: StoredUser

  constructor() {
    this.data = { firstName: 'FirstName', lastName: 'LastName' }
  }

  async getData(): Promise<StoredUser> {
    await sleep(1000)
    return { ...this.data }
  }

  async saveUser(value: StoredUser) {
    await sleep(1000)
    this.data = value
    return value
  }
}

/**
 * Dummy Database to emulate server-side actions
 */
export const db = new DB()
