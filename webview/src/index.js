import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import { AppContainer, TabContainer } from './components'
import { TableContainer } from './components/TableContainer'

// import InteractorFactory from './Interaction/InteractorFactory'
function tryAcquireVsCodeApi() {
  try {
    return acquireVsCodeApi()
  } catch {
    // In this case we are not in VsCode context
    return null
  }
}
// const Interactor = InteractorFactory.create()
const vsCodeApi = tryAcquireVsCodeApi()
const App = () => {
  const [tableData, setTableData] = useState(null)
  useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data
      console.log(message)
      switch (message.type) {
        case 'table-change':
          console.log('hello')
          setTableData(message.data)
          break
      }
    })
  }, [])
  return (
    <AppContainer>
      <TabContainer />
      <TableContainer data={tableData} />
    </AppContainer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
