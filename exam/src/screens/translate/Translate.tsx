import { omit } from 'lodash'
import {KeyboardEventHandler, useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Select from 'react-select'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import {paths} from '~/App.tsx'
import {languages}  from '~/languages'
// import {useMessengerStore} from '~/store.ts'
import {time, useAppStore} from '~/store.ts'
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
    // await api('messages/POST',{chat:chatId,files:fileInput.files, text: textarea.value},true,true)
    const api = `https://api.mymemory.translated.net/get?q=${textarea.value}&langpair=${language1}|${language2}`
    const r = await fetch(api).then(r => r.json())
    setResult(r.responseData.translatedText)
    console.log(r)
  }

  const [result, setResult] = useState('')
  const [language1, setLanguage1] = useState('Autodetect')
  const [language2, setLanguage2] = useState('en-GB')
  const [language,setLanguage] = [useAppStore((state) => state.language),useAppStore((state) => state.set)]
  const textareaOnKeypress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (
      e.key !== 'Enter' ||
    e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
    ) return
    e.preventDefault()
    translate()
  }
  // const increasePopulation = useMessengerStore((state) => state.increase)
  // const [chats, setChats] = useState<>([])
  const navigate=useNavigate()
  useEffect(() => {
    (async ()=>{
      // setChats(chatPropsAdapter((await api('chats/GET', {})).results))

    })()
  }, [])
  return (
    <>
      <div className={styles.top}><Select
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
        <textarea readOnly value={result}/>
      </div>
      

    </>
  )
}

export default Translate
