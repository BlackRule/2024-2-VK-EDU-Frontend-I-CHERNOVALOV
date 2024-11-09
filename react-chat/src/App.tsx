import './App.css'
import {useState} from 'react'
import Chat from 'screens/chat/Chat.tsx'
import Chats from 'screens/chats/Chats.tsx'
import {SwitchScreenTo} from './types.ts'


function App() {
  const [CurrentScreen, setCurrentScreen] = useState(()=>Chats)
  const switchScreenTo:SwitchScreenTo=(screen)=> {
    switch (screen) {
    case 'chats':
      setCurrentScreen(()=>Chats)
      break
    case 'chat':
      setCurrentScreen(()=>Chat)
      break
    default:
      throw Error(`Wrong screen ${screen}`)
    }
  }
  return (
    <>
      <CurrentScreen {...{switchScreenTo}} />
    </>
  )
}

export default App
