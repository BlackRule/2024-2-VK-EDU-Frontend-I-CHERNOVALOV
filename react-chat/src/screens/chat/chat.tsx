import './chat.css'
import {KeyboardEventHandler, useEffect, useRef, useState} from 'react'
import {Message as MessageT, SwitchScreenTo} from '@/types.ts'
import Screen from 'screens/Screen.jsx'


type MessageWithIsNew = MessageT & { isNew?: boolean };

function Message({name,time,text,isNew}:MessageWithIsNew){
  return <div className={'message' + (name === 'Иван' ? ' my' : '') + (isNew ? ' new' : '')}>
    <div className="top">
      <div className="name">{name}</div>
      <div className="time">{time}</div>
    </div>
    <div className="text">{text}</div>
  </div>
}

function autosize(textarea:HTMLTextAreaElement, row_limit:number, onAfterResize = function (new_height:number) {
}):()=>void {
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
    onAfterResize(Math.min(rows, row_limit)*line_height)
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

type ArrayOfMessagePropsWithNeedsScroll = Array<MessageWithIsNew> & { needsScroll?: boolean };

function Chat({switchScreenTo}:{switchScreenTo:SwitchScreenTo}) {
  const textareaRef=useRef<HTMLTextAreaElement>(null)
  const messagesScrollRef=useRef<HTMLDivElement>(null)
  const t = [] as ArrayOfMessagePropsWithNeedsScroll
  t.needsScroll=true
  const [data, setData] = useState(t)
  const dataToSave = useRef<MessageWithIsNew[]>([])
  const autosizeFnThatNeedsCleanup = useRef<(()=>void)|null>(null)

  useEffect(() => {
    if(textareaRef.current===null) return
    const textarea = textareaRef.current
    if(messagesScrollRef.current===null) return
    const messagesScroll = messagesScrollRef.current

    let item = localStorage.getItem('messages')
    if (item === null) {
      const default_data:MessageT[] = [
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
      ]
      localStorage.setItem('messages', JSON.stringify(default_data))
    }
    item = localStorage.getItem('messages')
    if (item !== null) {
      const data:ArrayOfMessagePropsWithNeedsScroll = JSON.parse(item)
      data.needsScroll=true
      setData(data)
      dataToSave.current=data
    }
    const unloadHandler = () => {
      for (const message of dataToSave.current) {
        delete message.isNew
      }
      localStorage.setItem('messages', JSON.stringify(dataToSave.current))
    }

    window.addEventListener('unload', unloadHandler)
    autosizeFnThatNeedsCleanup.current=autosize(textarea, 10, () => {
      messagesScroll.scrollTop = messagesScroll.scrollHeight
    })
    return () => {
      textarea.removeEventListener('input', autosizeFnThatNeedsCleanup.current!)
      window.removeEventListener('unload', unloadHandler)
      unloadHandler()
    }
  }, [])

  useEffect(()=>{
    if(!data.needsScroll) return
    data.needsScroll=false
    if(textareaRef.current===null) return
    const textarea = textareaRef.current
    if(messagesScrollRef.current===null) return
    const messagesScroll = messagesScrollRef.current
    textarea.value = ''
    textarea.dispatchEvent(new Event('input', {
      bubbles: true
    }))
    messagesScroll.scrollTop = messagesScroll.scrollHeight
  }, [data])

  function sendMessage() {
    if(textareaRef.current===null) return
    const textarea = textareaRef.current
    if (textarea.value.trim().length === 0) return
    const date = new Date()
    const hours = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')
    const text = textarea.value
    setData((data)=> {
      const t:ArrayOfMessagePropsWithNeedsScroll = [...data, {id: Date.now(), isNew: true, name: 'Иван', text: text, time: `${hours}:${minutes}`}]
      t.needsScroll=true
      dataToSave.current=t
      return t
    })

  }

  const textareaOnKeypress: KeyboardEventHandler<HTMLTextAreaElement>=(e) => {
    if (
      e.key !== 'Enter' ||
            e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
    ) return
    e.preventDefault()
    sendMessage()
  }

  return (
    <Screen>
      <div className="topbar">
        <a className="material-symbols-outlined" onClick={(e)=> {
          switchScreenTo('chats')
          e.preventDefault()
        }}>arrow_back</a>
        <div className="horizontal">
          <span className="material-symbols-outlined avatar">person</span>
          <div className="vertical">
            <div className="name">Дженнифер</div>
            <div className="last-seen">была 2 часа назад</div>
          </div>
        </div>
        <div><span className="material-symbols-outlined">search</span>
          <span className="material-symbols-outlined">more_vert</span></div>
      </div>
      <div className="messages-scroll" ref={messagesScrollRef}>
        <div className="messages">
          {data.map((message) =>
            <Message key={message.id} {...message}/>)}
        </div>
      </div>
      <form className="form" action="/">
        <textarea className="form-input" name="message-text" placeholder="Введите сообщение" onKeyPress={textareaOnKeypress} ref={textareaRef}></textarea>
        <span className="material-symbols-outlined">attachment</span>
        <span className="material-symbols-outlined" onClick={sendMessage}>send</span>
      </form>
    </Screen>
  )
}

export default Chat
