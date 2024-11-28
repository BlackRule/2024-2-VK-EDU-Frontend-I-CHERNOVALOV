import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import Topbar from 'components/Topbar/Topbar.tsx'
import Screen from 'screens/Screen.jsx'
import ScreenBottom from 'screens/components/ScreenBottom/ScreenBottom.tsx'
import {paths} from '~/App.tsx'
import { api } from '~/api.ts'
import {chatPropsAdapter} from '~/common.ts'
import Chat, {ChatProps} from './components/Chat.tsx'
import styles from './Chats.module.scss'

function Chats() {
  const [chats, setChats] = useState<ChatProps[]>([])
  const navigate=useNavigate()
  useEffect(() => {
    (async ()=>{
      setChats(chatPropsAdapter((await api('chats/GET', {})).results))
    })()
  }, [])
  return (
    <Screen>
      <Topbar>
        <MaterialSymbol symbol='menu'/>
        <span className={styles.title}>Messenger</span>
        <MaterialSymbol symbol='search'/>
      </Topbar>
      <ScreenBottom>
        <div className={styles.chats}>
          {
            chats.map((chat) =>
              <Chat key={chat.id} {...chat}/>)
          }
        </div>
        <button onClick={()=>navigate(paths.newChat)}><MaterialSymbol symbol="edit" className={styles.compose} hoverable={false}/></button>
      </ScreenBottom>
    </Screen>
  )
}

export default Chats
