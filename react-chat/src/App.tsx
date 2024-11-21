import {Centrifuge} from 'centrifuge'
import {useEffect, useRef, useState} from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import Chat from 'screens/chat/Chat.tsx'

import Chats from 'screens/chats/Chats.tsx'
import './App.css'
import NewChat from 'screens/newChat/NewChat.tsx'
import Profile from 'screens/profile/Profile.tsx'
import SignIn from 'screens/signIn/SgnIn.tsx'
import SignUp from 'screens/signUp/SignUp.tsx'
import {
  AddCallbackForCentrifuge,
  api,
  CallbackForCentrifuge,
  RemoveCallbackForCentrifuge,
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

/*
* subscription.on()  calls function even after subscription.removeAllListeners() so we need to make sure the function
* passed to subscription.on() returns without doing anything after subscription.removeAllListeners() is called
* */
{shouldBeCalled,cb}
function useCentrifuge(userId:string|null){
  const callbacksForCentrifuge = useRef<CallbackForCentrifuge[]>([]).current
  const addCallbackForCentrifuge = useRef<AddCallbackForCentrifuge>(
    (callback:CallbackForCentrifuge)=>
      callbacksForCentrifuge.push(callback)
  ).current
  const removeCallbackForCentrifuge = useRef<RemoveCallbackForCentrifuge>(
    (callbackId: number)=>
      callbacksForCentrifuge.splice(callbackId, 1)
  ).current
  const useCentrifugeLogger = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
    log:(...args)=>false&&console.log(...args),
  }
   useRef(0).current
  useEffect(() => {
    if (userId === null) {
      useCentrifugeLogger.log('no userId to connect Centrifuge')
      return
    }
    useCentrifugeLogger.log('centrifuge start')

    const centrifuge = new Centrifuge('wss://vkedu-fullstack-div2.ru/connection/websocket/', {
      // debug: true,
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
    const listenerId =getListenerId(function (ctx) {
      useCentrifugeLogger.log(ctx.data)
      callbacksForCentrifuge.forEach(cb=>cb(ctx.data))

    })
    subscription.on('publication', )
    subscription.subscribe()
    centrifuge.connect()
    useCentrifugeLogger.log('centrifuge end')

    return () => {
      // useCentrifugeLogger.log('uncentrifuge start')
      subscription.unsubscribe()
      subscription.removeAllListeners()
      centrifuge.removeSubscription(subscription)
      centrifuge.disconnect()
      useCentrifugeLogger.log('uncentrifuge end')
    }
  }, [userId])
  return [addCallbackForCentrifuge,removeCallbackForCentrifuge]
}

function App() {
  // const defaultData:MessagesWithNeedsScroll[]
  // const [data, setData] = useLocalStorage(defaultData)
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
