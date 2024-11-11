import {useCallback, useEffect, useRef, useState} from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'
import Chat from 'screens/chat/Chat.tsx'
import {MessagesWithNeedsScroll, MessageWithIsNew} from 'screens/chat/types.tsx'
import Chats from 'screens/chats/Chats.tsx'
import './App.css'


export const paths={
  chat : (chatId:number)=>`/chat/${chatId}`,
  chats : '/'
}


function useLocalStorage<T,TasSaved>(defaultDataAsSavedUsedToGetTypeOnly:TasSaved,default_data:T,T_to_TAS:(data:T)=>void){
  const [data, setData] = useState(default_data)
  const dataToSaveRef = useRef<TasSaved>([] as TasSaved)

  const unloadHandler = useCallback(() => {
    T_to_TAS(dataToSaveRef.current as unknown as T)
    localStorage.setItem('messages', JSON.stringify(dataToSaveRef.current))
  },[T_to_TAS,dataToSaveRef])
  useEffect(() => {
    dataToSaveRef.current = data as unknown as TasSaved
  }, [data])
  useEffect(() => {
    let item = localStorage.getItem('messages')
    if (item === null || !Array.isArray(JSON.parse(item)[0])) {
      localStorage.setItem('messages', JSON.stringify(default_data))
    }
    item = localStorage.getItem('messages')!
    const data: T = JSON.parse(item)
    setData(data)
    //during initial render
    // useEffect(() => { dataToSaveRef.current = default_data }, [data]) is triggered
    // because const [data, setData] = useState(default_data)
    // and return () => { unloadHandler() }
    // so below is needed
    dataToSaveRef.current = data as unknown as TasSaved
    window.addEventListener('unload', unloadHandler)
    return () => {
      window.removeEventListener('unload', unloadHandler)
      unloadHandler()
    }
  }, [T_to_TAS, default_data, unloadHandler])

  return [data, setData] as const
}

function App() {

  const T_to_TAS = useRef((ds:MessagesWithNeedsScroll[])=>{
    for (const d of ds) {
      for (const message of d) {
        delete message.isNew
      }
    }
  }).current
  const defaultDataAsSavedUsedToGetTypeOnly=useRef([] as MessageWithIsNew[][]).current
  const defaultData = useRef([[
    {
      id: 1,
      name: 'Дженнифер',
      text: 'Я тут кое-что нарисовала...\nПосмотри как будет время...',
      time: '10:53'
    },
    {
      id: 2,
      name: 'Иван',
      text: 'Горжусь тобой! Ты крутая!',
      time: '10:53'
    },
    {
      id: 3,
      name: 'Дженнифер',
      text: 'Тебе нравится как я нарисовала?',
      time: '10:53'
    },
    {
      id: 4,
      name: 'Иван',
      text: 'Джен, ты молодеееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееееец!',
      time: '10:53'
    },
  ],
  [
    {
      id: 5,
      name: 'Александр',
      text: 'Привет! Как дела?',
      time: '11:00'
    },
    {
      id: 6,
      name: 'Мария',
      text: 'Все хорошо, спасибо! А ты как?',
      time: '11:01'
    },
    {
      id: 7,
      name: 'Александр',
      text: 'Тоже отлично! Чем занимаешься?',
      time: '11:02'
    },
    {
      id: 8,
      name: 'Мария',
      text: 'Читаю интересную книгу по программированию. Как у тебя на работе?',
      time: '11:03'
    },
    {
      id: 9,
      name: 'Александр',
      text: 'Завален делами, но еще немного и будет свободное время!',
      time: '11:04'
    },
    {
      id: 10,
      name: 'Мария',
      text: 'Ну, удачи тебе! Не забывай отдыхать.',
      time: '11:05'
    },
    {
      id: 11,
      name: 'Дмитрий',
      text: 'Кто хочет в кино сегодня вечером?',
      time: '11:06'
    },
    {
      id: 12,
      name: 'Екатерина',
      text: 'Я бы пошла! Какой фильм будем смотреть?',
      time: '11:07'
    },
    {
      id: 13,
      name: 'Дмитрий',
      text: 'Предлагаю посмотреть новый фильм по Marvel.',
      time: '11:08'
    },
    {
      id: 14,
      name: 'Екатерина',
      text: 'Отличный выбор! Значит договорились.',
      time: '11:09'
    }
  ]
  ] as MessagesWithNeedsScroll[]).current
  const [data, setData] = useLocalStorage(defaultDataAsSavedUsedToGetTypeOnly,defaultData,T_to_TAS)
  const routes = [
    {
      element: <Chats/>,
      path: paths.chats,
    },
    {
      element: <Chat getData={(chatId)=>data[chatId]} setData={
        (chatId,cb)=>{
          const newData = [...data]
          newData[chatId]=cb(newData[chatId])
          setData(newData)
        }
      }/>,
      path: 'chat/:chatId',
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
