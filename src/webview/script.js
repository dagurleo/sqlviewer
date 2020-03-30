const vscode = acquireVsCodeApi()
console.log('hello from webview', vscode)

const root = document.querySelector('.root')

root.textContent = 'awejklawejlka'
var handleMessage = message => {
  console.log(message)
}

const handleTableChange = data => {
  console.log(data)
  root.textContent = data.fields.map(f => f.name).join(',')
}

window.addEventListener('message', event => {
  const message = event.data

  switch (message.type) {
    case 'table-change':
      handleTableChange(message.data)
      break
  }
})
