import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import Topbar from 'components/Topbar/Topbar.tsx'
import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import ScreenBottom from 'screens/components/ScreenBottom/ScreenBottom.tsx'
import Screen from 'screens/Screen.jsx'
import {paths} from '~/App.tsx'
import {f} from '~/common.ts'
import styles from './Chats.module.scss'
import Chat, {ChatProps} from './components/Chat.tsx'
import { api } from '~/api.ts'

function Chats() {
  const [chats, setChats] = useState<ChatProps[]>([])
  const navigate=useNavigate()
  useEffect(() => {
    (async ()=>{
      // debugger
      setChats(f((await api('chats/GET', {})).results))
    })()
  }, [])
  return (
    <Screen>
      <Link to={paths.signIn}>SignIn</Link>
      <Link to={paths.signUp}>SignUp</Link>
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
