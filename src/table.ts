import * as vscode from 'vscode'
export class Table extends vscode.TreeItem {
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
}
