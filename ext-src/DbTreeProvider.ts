import * as vscode from 'vscode'
import pgService from './dbConnection'
import { Table } from './table'
import DbConnection from './dbConnection'
import { Db } from './db'
export class DbTreeProvider implements vscode.TreeDataProvider<any> {
  private dbStrings: any[] | undefined
  private connectedDB: string | undefined
  private connectedSchemas: any
  constructor(private context: vscode.ExtensionContext) {
    this.dbStrings = context.globalState.get('dbstrings')
  }
  private _onDidChangeTreeData: vscode.EventEmitter<
    Table | undefined
  > = new vscode.EventEmitter<Table | undefined>()
  readonly onDidChangeTreeData: vscode.Event<Table | undefined> = this
    ._onDidChangeTreeData.event

  refresh(dbName: string, tables: any): void {
    this.connectedDB = dbName
    let schemas: any[] = []
    for (let table of tables.rows) {
      const schemaIndex = schemas.findIndex(
        s => s.schemaname === table.schemaname
      )
      if (schemaIndex >= 0) {
        schemas[schemaIndex].tables.push(table.tablename)
      } else {
        schemas.push({
          schemaname: table.schemaname,
          tables: [table.tablename]
        })
      }
    }
    this.connectedSchemas = schemas
    this._onDidChangeTreeData.fire()
  }
  async getChildren(parent?: any): Promise<Table[]> {
    let treeTables = []
    if (parent && parent.type) {
      const foundSchema: any = this.connectedSchemas.find(
        (s: any) => s.schemaname === parent.type
      )
      if (parent.type === this.connectedDB) {
        if (this.connectedSchemas) {
          for (let schema of this.connectedSchemas) {
            const table = new Table(
              schema.schemaname,
              schema.schemaname,
              vscode.TreeItemCollapsibleState.Collapsed
            )
            treeTables.push(table)
          }
          return treeTables
        } else {
          return []
        }
      } else if (foundSchema) {
        for (let t of foundSchema.tables) {
          const table = new Table(
            foundSchema.schemaname,
            t,
            vscode.TreeItemCollapsibleState.None,
            {
              command: 'extension.openTable',
              title: 'Wow',
              arguments: [{ schemaname: foundSchema.schemaname, tablename: t }]
            }
          )
          treeTables.push(table)
        }
        return treeTables
      }
      return []
    } else {
      if (this.dbStrings) {
        for (let dbString of this.dbStrings) {
          if (dbString) {
            const collapsed = dbString.name === this.connectedDB
            const table = new Db(
              dbString.name,
              dbString.name,
              collapsed
                ? vscode.TreeItemCollapsibleState.Collapsed
                : vscode.TreeItemCollapsibleState.None,
              {
                command: 'extension.connectDatabase',
                title: 'Wow',
                arguments: [dbString]
              }
            )
            treeTables.push(table)
          }
        }
        return treeTables
      }
      return []
    }
  }

  getTreeItem(item: Table): vscode.TreeItem {
    return item
  }
}
