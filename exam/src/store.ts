import {Simulate} from 'react-dom/test-utils'
import {create} from 'zustand'
import {devtools, persist, subscribeWithSelector} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'
import {shallow} from 'zustand/vanilla/shallow'


type History = { l1: string, l2: string,i:string, o: string }[]

interface State {
    hashToHistoryIdx: Record<string, number>,
    history: History,
    input: string,
    language1: string,
    language2: string,
    output: string,
    setHistory: (h:History) => void,
    setInput: (i:string) => void,
    setLanguage1: (l:string) => void,
    setLanguage2: (l:string) => void,
    setOutput: (o:string) => void

}

export const useAppStore = (()=>{
  const store = create<State>()(
    devtools(
      persist(
        subscribeWithSelector(
          immer((set) => ({
            hashToHistoryIdx:{},
            history: [],
            input: '',
            language1: 'Autodetect',
            language2: 'en-GB',
            output: '',
            setHistory: (h: History) => {
              set((state) => {
                state.history = h
              })
            },
            
            setInput: (i: string) => {
              set((state) => {
                state.input = i
              })
            },
            setLanguage1: (l: string) =>
              set((state) => {
                state.language1 = l
              }),
            setLanguage2: (l: string) =>
              set((state) => {
                state.language2 = l
              }),
            setOutput: (o: string) => {
              set((state) => {
                state.output = o
              })
            },
          })
          )
        ),
        {
          name: 'storage',
        }
      )
    )
  )
  console.log('store created')
  const unsub1 = store.subscribe(
    (state) => [state.language1, state.language2,state.input],
    async (state)=>{
      if(store.getState().input.length===0) return
      const api = `https://api.mymemory.translated.net/get?q=${state[2]}&langpair=${state[0]}|${state[1]}`
      const r = (await fetch(api).then(r => r.json())).responseData
      store.getState().setOutput(r.translatedText)
      console.log([...store.getState().history,
        {
          l1:
            state[0] === 'Autodetect' ? r.detectedLanguage : state[0],
          l2: state[1], o: r.translatedText
        }])
      store.getState().setHistory(
        [...store.getState().history,
          {
            l1:
              state[0] === 'Autodetect' ? r.detectedLanguage : state[0],
            l2: state[1], o: r.translatedText,i:state[2]
          }]
      )

      console.log(state)
    },{ equalityFn: shallow })
  // Unsubscribe listeners
  // unsub1()
  return store
})()

