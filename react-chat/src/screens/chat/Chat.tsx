import {
  KeyboardEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import {SwitchScreenTo} from '@/types.ts'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import Topbar from 'components/Topbar/Topbar.tsx'
import Screen from 'screens/Screen.jsx'
import Messages from 'screens/chat/components/Messages/Messages.tsx'
import {MessagesWithNeedsScroll, MessageWithIsNew} from 'screens/chat/types.tsx'
import styles from './Chat.module.scss'

function useAutosize(textareaRef: RefObject<HTMLTextAreaElement>) {
  function autosize(textarea: HTMLTextAreaElement, row_limit: number): () => void {
    function textareaOnInput() {

      // Reset rows attribute to get accurate scrollHeight
      textarea.setAttribute('rows', '1')

      // Get the computed values object reference
      const cs = getComputedStyle(textarea)

      // Force content-box for size accurate line-height calculation
      // Remove scrollbars, lock width (subtract inline padding and inline border widths)
      // and remove inline padding and borders to keep width consistent (for text wrapping accuracy)
      const inline_padding = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
      const inline_border_width = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
      textarea.style.setProperty('overflow', 'hidden', 'important')
      textarea.style.setProperty('width', (parseFloat(cs['width']) - inline_padding - inline_border_width) + 'px')
      textarea.style.setProperty('box-sizing', 'content-box')
      textarea.style.setProperty('padding-inline', '0')
      textarea.style.setProperty('border-width', '0')

      // Get the base line height, and top / bottom padding.
      const block_padding = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
      const line_height =
        // If line-height is not explicitly set, use the computed height value (ignore padding due to content-box)
        cs.lineHeight === 'normal' ? parseFloat(cs['height'])
          // Otherwise (line-height is explicitly set), use the computed line-height value.
          : parseFloat(cs.lineHeight)

      // Get the scroll height (rounding to be safe to ensure cross browser consistency)
      const scroll_height = Math.round(textarea.scrollHeight)

      // Undo overflow, width, border-width, box-sizing & inline padding overrides
      textarea.style.removeProperty('width')
      textarea.style.removeProperty('box-sizing')
      textarea.style.removeProperty('padding-inline')
      textarea.style.removeProperty('border-width')
      textarea.style.removeProperty('overflow')

      // Subtract block_padding from scroll_height and divide that by our line_height to get the row count.
      // Round to nearest integer as it will always be within ~.1 of the correct whole number.
      const rows = Math.round((scroll_height - block_padding) / line_height)

      // Set the calculated rows attribute (limited by row_limit)
      textarea.setAttribute('rows', '' + Math.min(rows, row_limit))
    }

    // Set default for row_limit parameter
    row_limit = Number(row_limit ?? '5')
    if (!row_limit) {
      row_limit = 5
    }

    // Set required styles for this to function properly.
    textarea.style.setProperty('resize', 'none')
    textarea.style.setProperty('min-height', '0')
    textarea.style.setProperty('max-height', 'none')
    textarea.style.setProperty('height', 'auto')

    // Set rows attribute to number of lines in content
    textarea.addEventListener('input', textareaOnInput)

    // Trigger the event to set the initial rows value
    textarea.dispatchEvent(new Event('input', {
      bubbles: true
    }))

    return textareaOnInput
  }
  const autosizeFnThatNeedsCleanup = useRef<(() => void) | null>(null)
  useEffect(() => {
    if (textareaRef.current === null) return
    const textarea = textareaRef.current

    autosizeFnThatNeedsCleanup.current = autosize(textarea, 10)
    return () => {
      textarea.removeEventListener('input', autosizeFnThatNeedsCleanup.current!)
    }
  }, [textareaRef])
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
    if (item === null) {
      localStorage.setItem('messages', JSON.stringify(default_data))
    }
    item = localStorage.getItem('messages')
    const data: T = JSON.parse(item!)
    setData(data)
    //during initial render
    // useEffect(() => { dataToSaveRef.current = default_data }, [data]) is triggered
    // because const [data, setData] = useState(default_data)
    // and return () => { unloadHandler() }
    // so below is needed
    dataToSaveRef.current = data as unknown as TasSaved
    window.addEventListener('beforeunload', unloadHandler)
    return () => {
      window.removeEventListener('beforeunload', unloadHandler)
      unloadHandler()
    }
  }, [T_to_TAS, default_data, unloadHandler])
  

  
  return [data, setData] as const
}

function Chat({switchScreenTo}: { switchScreenTo: SwitchScreenTo }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const T_to_TAS = useRef((d:MessagesWithNeedsScroll)=>{
    for (const message of d) {
      delete message.isNew
    }
  }).current
  const defaultDataAsSavedUsedToGetTypeOnly=useRef([] as MessageWithIsNew[]).current
  const defaultData = useRef([
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
  ] as MessagesWithNeedsScroll).current
  const [data, setData] = useLocalStorage(defaultDataAsSavedUsedToGetTypeOnly,defaultData,T_to_TAS)
  useAutosize(textareaRef)

  function sendMessage() {
    if (textareaRef.current === null) return
    const textarea = textareaRef.current
    if (textarea.value.trim().length === 0) return
    const date = new Date()
    const hours = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')
    const text = textarea.value
    setData((prevData) => {
      const t = [...prevData, {
        id: Date.now(),
        isNew: true,
        name: 'Иван',
        text: text,
        time: `${hours}:${minutes}`
      }] as  MessagesWithNeedsScroll
      t.needsScroll=true
      if (textareaRef.current === null) return t
      const textarea = textareaRef.current
      textarea.value = ''
      textarea.dispatchEvent(new Event('input', {
        bubbles: true
      }))
      return t
    })

  }

  const textareaOnKeypress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (
      e.key !== 'Enter' ||
      e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
    ) return
    e.preventDefault()
    sendMessage()
  }

  return (
    <Screen>
      <Topbar>
        <MaterialSymbol onClick={(e) => {
          switchScreenTo('chats')
        }} symbol='arrow_back'/>
        <div className={styles.horizontal}>
          <MaterialSymbol symbol='person' hoverable={false}/>
          <div className={styles.vertical}>
            <div className={styles.name}>Дженнифер</div>
            <div className={styles.lastSeen}>была 2 часа назад</div>
          </div>
        </div>
        <div><MaterialSymbol symbol='search' />
          <MaterialSymbol symbol='more_vert' /></div>
      </Topbar>
      <Messages data={data}/>
      <div className={styles.form}>
        <textarea className={styles.formInput} name="message-text" placeholder="Введите сообщение"
          onKeyPress={textareaOnKeypress} ref={textareaRef}></textarea>
        <MaterialSymbol symbol='attachment' />
        <MaterialSymbol symbol='send' onClick={sendMessage}/>
      </div>
    </Screen>
  )
}

export default Chat
