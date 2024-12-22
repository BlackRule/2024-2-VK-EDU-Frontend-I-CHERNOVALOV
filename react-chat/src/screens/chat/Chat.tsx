import {KeyboardEventHandler, RefObject, useCallback, useEffect, useRef, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import Topbar from 'components/Topbar/Topbar.tsx'
import Screen from 'screens/Screen.jsx'
import Messages from 'screens/chat/components/Messages/Messages.tsx'
import {MessagesWithNeedsScroll} from 'screens/chat/types.tsx'
import ScreenBottom from 'screens/components/ScreenBottom/ScreenBottom.tsx'
import {paths} from '~/App.tsx'
import {AddCallbackForCentrifuge, api, CallbackForCentrifuge, RemoveCallbackForCentrifuge} from '~/api.ts'
import {
  messageAdapter,
  Message, arrayAdapter,
} from '~/common.ts'
import styles from './Chat.module.scss'

function useAutosize(textareaRef: RefObject<HTMLTextAreaElement>) {
  function autosize(textarea: HTMLTextAreaElement, row_limit: number): () => void {
    function textareaOnInput() {

      // Reset rows attribute to get accurate scrollHeight
      textarea.setAttribute('rows', '1')

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

function Chat({addCallbackForCentrifuge,removeCallbackForCentrifuge}:{   addCallbackForCentrifuge: AddCallbackForCentrifuge,removeCallbackForCentrifuge:RemoveCallbackForCentrifuge }) {
  const navigate=useNavigate()
  const _chatId = useParams<{chatId: string}>().chatId
  if(!_chatId) {
    navigate(paths.chats)
    //todo Will execution get terminated here?
  }
  const chatId=_chatId as string
  const [data, setData] = useState<Message[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useAutosize(textareaRef)
  const fileInputRef = useRef<HTMLInputElement& { files: FileList }>(null)
  const [filesURLs, setFilesURLs] = useState<string[]>([])
  async function sendMessage() {
    if (textareaRef.current === null) return
    if (fileInputRef.current === null) return
    const textarea = textareaRef.current
    const fileInput = fileInputRef.current
    if (textarea.value.trim().length === 0 && fileInput.files.length===0) return
    await api('messages/POST',{chat:chatId,files:fileInput.files, text: textarea.value},true,true)
  }

  const filesOnChange: React.ChangeEventHandler<HTMLInputElement>=useCallback((event) => {
    if(event!.target!.files===null) return
    const a=[]
    for (const file of event!.target!.files) {
      a.push(URL.createObjectURL(file))
    }
    setFilesURLs(a)
  },[])
  const textareaOnKeypress: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (
      e.key !== 'Enter' ||
      e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
    ) return
    e.preventDefault()
    sendMessage()
  }

  const callbackForCentrifuge=useRef<CallbackForCentrifuge>((data)=>{
    console.log(data)
    setData((prevData) => {
      // @ts-expect-error
      const t = [...prevData, messageAdapter(data.message)] as  MessagesWithNeedsScroll
      t.needsScroll=true
      if (textareaRef.current === null) return t
      const textarea = textareaRef.current
      textarea.value = ''
      textarea.dispatchEvent(new Event('input', {
        bubbles: true
      }))
      return t
    })
  }).current

  const locationOnClick=useRef<React.MouseEventHandler<HTMLSpanElement>>(()=>{
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords
        api('messages/POST',{chat:chatId,text: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`})
      },
      (error) => {
        //todo
        console.error('Error obtaining location', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    )
  }).current


  useEffect(() => {
    const callbackId=addCallbackForCentrifuge(callbackForCentrifuge)
    return ()=>{
      removeCallbackForCentrifuge(callbackId)
    }
  }, [])

  useEffect(() => {
    (async()=>
      setData(arrayAdapter(
        // @ts-expect-error
        (await api('messages/GET',{chat:chatId})).results,messageAdapter
      ))
    )()
  }, [])

  return (
    <Screen>
      <Topbar>
        <Link to={paths.chats}><MaterialSymbol symbol='arrow_back'/></Link>
        <Link className={styles.horizontal} to={paths.profile}>
          <MaterialSymbol symbol='person' hoverable={false}/>
          <div className={styles.vertical}>
            <div className={styles.name}>Дженнифер</div>
            <div className={styles.lastSeen}>была 2 часа назад</div>
          </div>
        </Link>
        <div><MaterialSymbol symbol='search' />
          <MaterialSymbol symbol='more_vert' /></div>
      </Topbar>
      <ScreenBottom>
        <Messages data={data}/>
        <div className={styles.imageAttachments} title="to remove images click attach and click cancel">
          {filesURLs.map((fileURL) => <img key={fileURL} src={fileURL}/>)}
        </div>
        <div className={styles.form}>
          <textarea className={styles.formInput} name="message-text" placeholder="Введите сообщение"
            onKeyPress={textareaOnKeypress} ref={textareaRef}></textarea>
          <label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple 
              style={{display:'none'}} onChange={filesOnChange}/>
            <MaterialSymbol symbol="image"/>
          </label>
          <MaterialSymbol symbol='location_on' onClick={locationOnClick}/>
          <button onClick={sendMessage}><MaterialSymbol symbol='send'/></button>
        </div>
      </ScreenBottom>
    </Screen>
  )
}

export default Chat
