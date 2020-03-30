import * as vscode from 'vscode'
import * as path from 'path'

export class Db extends vscode.TreeItem {
  public type: string
  public label: string
  public command?: vscode.Command
  constructor(
    type: string,
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command
  ) {
    super(label, collapsibleState)
    this.type = type
    this.label = label
    this.command = command
  }

  get tooltip(): string {
    return `${this.label}-${this.label}`
  }

  get description(): string {
    return this.label
  }
  iconPath = {
    light: path.join(__filename, '..', '..', 'media', 'db.png'),
    dark: path.join(__filename, '..', '..', 'media', 'db.png')
  }

  contextValue = 'db'
}
