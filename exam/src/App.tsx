import {createHashRouter, RouterProvider} from 'react-router-dom'
import './App.css'
import Translate from 'screens/translate/Translate.tsx'
import History from 'screens/history/History.tsx'

import type {} from '@redux-devtools/extension' 


export const paths={
  translate : '/',
  history : '/history',
}






function App() {

  const routes = [
    {
      element: <Translate/>,
      path: paths.translate,
    },
    {
      element: <History/>,
      path: paths.history,
    }
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
