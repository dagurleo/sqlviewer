import * as pg from 'pg'
const Pool = pg.Pool
interface DbConnectionOptions {
  user?: string
  host?: string
  password?: string
  database?: string
  port?: number
  uri?: string
}

export default class DbConnection {
  private pool: pg.Pool

  constructor(options: DbConnectionOptions) {
    try {
      if (options.uri) {
        this.pool = new Pool({ connectionString: options.uri })
      } else {
        this.pool = new Pool({
          user: options.user,
          host: options.host,
          database: options.database,
          port: options.port || 5432
        })
      }
    } catch (error) {
      throw error
    }
  }

  async getTables() {
    const result = await this.pool.query(
      `SELECT * FROM pg_catalog.pg_tables order by schemaname`
    )
    return result
  }

  async selectAllFromTable(schemaName: string, tableName: string) {
    try {
      const command = `SELECT * from ${schemaName}.${tableName}`
      const result = await this.pool.query(command)
      return result
    } catch (error) {
      return null
    }
  }

  static async testConnection(options: DbConnectionOptions) {
    let client: pg.Client | undefined = undefined
    try {
      if (options.uri) {
        client = new pg.Client({ connectionString: options.uri })
      } else {
        client = new pg.Client({
          user: options.user,
          host: options.host,
          database: options.database,
          port: options.port || 5432
        })
      }
      if (client) {
        console.log(client)
        try {
          await client.connect()
          const result = await client.query('SELECT NOW()')
          if (result) {
            console.log('Connection OK')
            client.end()
            return true
          }
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      }
      return false
    } catch (error) {
      console.log('Error in connecting to db', error)
      return false
    }
  }

  static parseUri(uri: string) {
    const split = uri.split(
      /^((postgres):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
    )
    console.log(split)
  }
}

// const run = async (query: string) => {
//   const pool = connect()
//   query = query.toLowerCase()
//   query = query.replace('from ', 'from public.')

//   const result = await pool.query(query)
//   return result
// }

// const connect = () => {
//   const pool = new Pool({
//     user: 'admin',
//     host: 'localhost',
//     database: 'forumstest',
//     port: 5432
//   })
//   return pool
// }
