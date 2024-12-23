import { omit } from 'lodash'
import {KeyboardEventHandler, useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Select from 'react-select'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import {useShallow} from 'zustand/react/shallow'
import {paths} from '~/App.tsx'
import {languages}  from '~/languages'
import {useAppStore} from '~/store.ts'
import styles from './Translate.module.scss'

function toOptions(object:Record<string, string>){
  return Object.entries(object).map(([key,value]) => {
    return {label: value, value: key}
  })
}

function toOption(key:string){
  return {label: languages[key], value: key}
}

function Translate() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  async function translate() {
    if (textareaRef.current === null) return
    const textarea = textareaRef.current
    if (textarea.value.trim().length === 0) return
    setInput(textarea.value)
  }


  const [language1,language2,output,setInput,setLanguage1,setLanguage2] =
    useAppStore(useShallow((state) =>
      [state.language1,state.language2,state.output,state.setInput,state.setLanguage1,state.setLanguage2])
    )

  const textareaOnKeypress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (
      e.key !== 'Enter' ||
    e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
    ) return
    e.preventDefault()
    translate()
  }
  const navigate=useNavigate()

  return (
    <>
      <div className={styles.top}>
        <Select
          value={toOption(language1)}
          onChange={(nv) => nv && setLanguage1(nv.value)}
          options={toOptions(languages)}
        />
        <button><MaterialSymbol symbol="swap_horiz" className={styles.compose}
          hoverable={false}/></button>
        <Select
          value={toOption(language2)}
          onChange={(nv) => nv && setLanguage2(nv.value)}
          options={toOptions(omit(languages, ['Autodetect']))}
        />
        <button onClick={() => navigate(paths.history)}><MaterialSymbol symbol="history" className={styles.compose}/></button>
      </div>
      <div>Press enter in the first field to translate</div>
      <div className={styles.bottom}>
        <textarea ref={textareaRef} onKeyPress={textareaOnKeypress}/>
        <textarea readOnly value={output}/>
      </div>
      

    </>
  )
}

export default Translate
