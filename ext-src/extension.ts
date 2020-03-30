// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import ReactPanel from './ReactPanel'
import DbConnection from './dbConnection'
import { TableProvider } from './tableProvider'
import { DbTreeProvider } from './DbTreeProvider'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined
  let currentDb: DbConnection | undefined

  const dbTreeProvider = new DbTreeProvider(context)
  try {
    vscode.window.registerTreeDataProvider('psqlviewer', dbTreeProvider)
    // const tableProvider = new TableProvider(context)
  } catch (error) {}
  // The co// This line of code will only be executed once when your extension is activatedmmand has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let runSql = vscode.commands.registerCommand('extension.runSql', async () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    const activeEditor = vscode.window.activeTextEditor
    if (activeEditor && activeEditor.document) {
      // console.log('Active Editor:', activeEditor)

      const firstLine = activeEditor.document.lineAt(0)
      const lastLine = activeEditor.document.lineAt(
        activeEditor.document.lineCount - 1
      )
      const textRange = new vscode.Range(
        firstLine.range.start,
        lastLine.range.end
      )
      // console.log(firstLine, lastLine, textRange)
      const fullText = activeEditor.document.getText()
      // console.log(fullText)

      currentPanel = vscode.window.createWebviewPanel(
        'psqlviewer',
        'SQL Viewer',
        vscode.ViewColumn.One,
        { enableScripts: true }
      )
      const filePath: vscode.Uri = vscode.Uri.file(
        path.join(context.extensionPath, 'src', 'webview', 'index.html')
      )
      const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, 'src', 'webview')
      )
      const scriptSrc = currentPanel.webview.asWebviewUri(onDiskPath)

      // currentPanel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8')
      // panel.webview.html = getWebviewContent(panels.length.toString())
    }
  })

  const connectDatabase = vscode.commands.registerCommand(
    'extension.connectDatabase',
    async (args: any) => {
      if (currentDb) {
        // TODO: Prompt user if he wants to close the current connection
      }
      try {
        const command: any = args.command ? args?.command?.arguments[0] : args
        if (command?.uri) {
          console.log(command.uri)
          currentDb = new DbConnection({ uri: command.uri })
          const tables = await currentDb.getTables()

          console.log(tables)
          dbTreeProvider.refresh(command.name, tables)
        }
      } catch (error) {
        // TODO: Can't connect db error
        console.log(error)
      }
    }
  )

  const openWebView = () => {
    console.log('Opening webview wow')

    ReactPanel.createOrShow(context.extensionPath)

    // currentPanel = vscode.window.createWebviewPanel(
    //   'psqlviewer',
    //   'SQL Viewer',
    //   vscode.ViewColumn.One,
    //   { enableScripts: true }
    // )
    // const filePath: vscode.Uri = vscode.Uri.file(
    //   path.join(context.extensionPath, 'src', 'webview', 'index.html')
    // )
    // const onDiskPath = vscode.Uri.file(
    //   path.join(context.extensionPath, 'src', 'webview')
    // )
    // const scriptSrc = currentPanel.webview.asWebviewUri(onDiskPath)
    // currentPanel.webview.html = getWebviewContent(scriptSrc)
    // currentPanel.onDidDispose(
    //   () => {
    //     currentPanel = undefined
    //   },
    //   undefined,
    //   context.subscriptions
    // )
  }

  let openTable = vscode.commands.registerCommand(
    'extension.openTable',
    async (args: any) => {
      if (args?.schemaname && args?.tablename) {
        console.log(args)
        if (currentDb) {
          const result = await currentDb.selectAllFromTable(
            args.schemaname,
            args.tablename
          )
          if (!currentPanel) {
            openWebView()
          }
          if (result && currentPanel) {
            console.log('Sending result to webview', currentPanel)
            currentPanel?.webview.postMessage({
              type: 'table-change',
              data: result
            })
            // currentPanel.webview.postMessage({ command: 'refactor' })
          } else {
            // TODO: Show message
          }
        }
      }
    }
  )
  let getDbUri = vscode.commands.registerCommand(
    'extension.getUri',
    async () => {
      let options: vscode.InputBoxOptions = {
        prompt: 'Connection string: ',
        placeHolder: 'postgres://...'
      }

      const value = await vscode.window.showInputBox(options)
      if (!value) {
        return
      }

      const canConnect = await DbConnection.testConnection({ uri: value })
      if (canConnect) {
        const name = await vscode.window.showInputBox({
          prompt: 'Name For DB',
          placeHolder: 'Cooldatabase'
        })
        console.log(name)
        if (!name) {
          return
        }

        let dbStrings: any[] | undefined = context.globalState.get('dbstrings')
        if (!dbStrings) {
          dbStrings = []
        }
        dbStrings.push({ name, uri: value })
        context.globalState.update('dbstrings', dbStrings)
      }
    }
  )
  context.subscriptions.push(runSql)
  context.subscriptions.push(openTable)
  context.subscriptions.push(getDbUri)
  context.subscriptions.push(connectDatabase)
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(diskPath: vscode.Uri) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div class="root" />
    </body>
  
    <script src="${diskPath}/script.js"></script>
  </html>
  `
}
