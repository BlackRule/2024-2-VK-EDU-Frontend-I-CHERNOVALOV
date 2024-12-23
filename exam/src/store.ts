import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'

export type Language = 'ru' | 'en';

interface State {
    language: Language
    set: (l:Language) => void
}

export const useAppStore = create<State>()(
  devtools(
    persist(
      immer((set) => ({
        language: 'ru',
        set: (l:Language) =>
          set((state) => {state.language=l}),
      })),
      {
        name: 'storage',
      }
    )
  )
)
console.log('not execed on import')
export const time=Date.now() // "singleton?"