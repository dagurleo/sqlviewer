import BrowserInteractor from './BrowserInteractor'
import VsCodeInteractorFactory from './VsCodeInteractorFactory'

let data = null
function tryAcquireVsCodeApi() {
  try {
    return acquireVsCodeApi()
  } catch {
    // In this case we are not in VsCode context
    return null
  }
}

const create = () => {
  const vsCodeApi = tryAcquireVsCodeApi()

  if (vsCodeApi === null) {
    return BrowserInteractor
  } else {
    return VsCodeInteractorFactory.createFromVsCodeApi(vsCodeApi)
  }
}

const handleMessage = event => {
  const message = event.data

  console.log(message)
  switch (message.type) {
    case 'table-change':
      data = message.data
      break
  }
}

const getCurrentData = () => {
  return data
}

const InteractorFactory = {
  create,
  handleMessage,
  getCurrentData
}

export default InteractorFactory
