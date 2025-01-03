import {Centrifuge} from 'centrifuge'
import {useEffect, useRef, useState} from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import Chat from 'screens/chat/Chat.tsx'

import Chats from 'screens/chats/Chats.tsx'
import './App.css'
import NewChat from 'screens/newChat/NewChat.tsx'
import NewGroupChat from 'screens/newGroupChat/NewGroupChat.tsx'
import Profile from 'screens/profile/Profile.tsx'
import SignIn from 'screens/signIn/SgnIn.tsx'
import SignUp from 'screens/signUp/SignUp.tsx'
import {
  AddCallbackForCentrifuge,
  api,
  CallbackForCentrifuge,
  RemoveCallbackForCentrifuge,
} from '~/api.ts'
import {
  USER_ID_LS_KEY
} from '~/common.ts'


export const paths={
  chat : (chatId:string)=>`/chat/${chatId}`,
  chats : '/',
  newChat: '/newChat',
  newGroupChat: '/newGroupChat',
  profile : '/profile',
  signIn : '/SignIn',
  signUp: '/signUp',
}


function useCentrifuge(userId:string|null){
  const callbacksForCentrifuge = useRef<CallbackForCentrifuge[]>([]).current
  const addCallbackForCentrifuge = useRef<AddCallbackForCentrifuge>(
    (callback:CallbackForCentrifuge)=> callbacksForCentrifuge.push(callback)-1
  ).current
  const removeCallbackForCentrifuge = useRef<RemoveCallbackForCentrifuge>(
    (callbackId: number)=> callbacksForCentrifuge.splice(callbackId, 1)
  ).current

   
  useEffect(() => {
    if (userId === null) {
      return
    }

    const centrifuge = new Centrifuge('wss://vkedu-fullstack-div2.ru/connection/websocket/', {
      getToken: (ctx) =>
        new Promise((resolve, reject) =>
          api('centrifugo/connect/POST', ctx)
            .then((data) => resolve(data.token))
            .catch((err) => reject(err))
        )
    })
    const subscription = centrifuge.newSubscription(userId, {
      getToken: (ctx) =>
        new Promise((resolve, reject) =>
          api('centrifugo/subscribe/POST', ctx)
            .then((data) => resolve(data.token))
            .catch((err) => reject(err))
        )
    })
    subscription.on('publication', function (ctx) {
      callbacksForCentrifuge.forEach(cb=>cb(ctx.data))
    })
    subscription.subscribe()
    centrifuge.connect()

    return () => {
      centrifuge.disconnect()
      subscription.removeAllListeners()
      subscription.unsubscribe()
    }
  }, [userId])
  return [addCallbackForCentrifuge,removeCallbackForCentrifuge] as const
}

function App() {
  const [userId, setUserId] = useState<null|string>(localStorage.getItem(USER_ID_LS_KEY))

  const [addCallbackForCentrifuge,removeCallbackForCentrifuge]=useCentrifuge(userId)
  const routes = [
    {
      element: <Chats/>,
      path: paths.chats,
    },
    {
      element: <Chat {...{addCallbackForCentrifuge,removeCallbackForCentrifuge}}/>,
      path: 'chat/:chatId',
    },
    {
      element: <Profile/>,
      path: paths.profile,
    },
    {
      element: <SignIn setUserId={setUserId}/>,
      path: paths.signIn
    },
    {
      element: <NewChat/>,
      path: paths.newChat
    },
    {
      element: <NewGroupChat/>,
      path: paths.newGroupChat
    },
    {
      element: <SignUp/>,
      path: paths.signUp
    },
  ]
  const router = createHashRouter(routes,{
    future: {v7_fetcherPersist:true,v7_normalizeFormMethod:true,v7_partialHydration:true,v7_relativeSplatPath:true,v7_skipActionErrorRevalidation:true},
  })

  return (
    <>
      <RouterProvider router={router} future={{v7_startTransition:true}}/>
    </>
  )
}

export default App
