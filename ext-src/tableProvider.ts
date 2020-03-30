import * as vscode from 'vscode'
import pgService from './dbConnection'
import { Table } from './table'
import DbConnection from './dbConnection'
export class TableProvider implements vscode.TreeDataProvider<any> {
  private dbConnection = new DbConnection({
    uri: 'postgres://admin:@localhost:5432/forumstest'
  })
  constructor(private context: vscode.ExtensionContext) {}

  async getChildren(table?: Table): Promise<Table[]> {
    const result = await this.dbConnection.getTables()
    console.log(result)
    let treeTables = []
    if (result.rows) {
      for (let row of result.rows) {
        if (row) {
          const table = new Table(
            row.schemaname,
            row.tablename,
            vscode.TreeItemCollapsibleState.None,
            {
              command: 'extension.openTable',
              title: 'Wow',
              arguments: [row]
            }
          )
          treeTables.push(table)
        }
      }
      return treeTables
    }
    return []
  }

  getTreeItem(table: Table): vscode.TreeItem {
    return table
  }
}
