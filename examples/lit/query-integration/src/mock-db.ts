export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface StoredUser {
  firstName: string
  lastName: string
}

class DB {
  private data: StoredUser = {
    firstName: 'FirstName',
    lastName: 'LastName',
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

export const db = new DB()
