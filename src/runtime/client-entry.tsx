import { createRoot  } from 'react-dom/client'

import { App} from './App'

function renderInBrower (){
    const containerEl = document.getElementById('root');
    if(!containerEl){
      throw new Error("#root element not found")
    }
    createRoot(containerEl).render(<App />)
}

renderInBrower()