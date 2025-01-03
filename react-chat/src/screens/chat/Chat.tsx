import cn from 'classnames'
import {IMediaRecorder, MediaRecorder, register} from 'extendable-media-recorder'
import {connect} from 'extendable-media-recorder-wav-encoder'
import {DragEvent, KeyboardEventHandler, RefObject, useCallback, useEffect, useRef, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import Topbar from 'components/Topbar/Topbar.tsx'
import Screen from 'screens/Screen.jsx'
import Messages from 'screens/chat/components/Messages/Messages.tsx'
import {MessagesWithNeedsScroll} from 'screens/chat/types.tsx'
import ScreenBottom from 'screens/components/ScreenBottom/ScreenBottom.tsx'
import {paths} from '~/App.tsx'
import {AddCallbackForCentrifuge, api, CallbackForCentrifuge, RemoveCallbackForCentrifuge} from '~/api.ts'
import {arrayAdapter, Message, messageAdapter,} from '~/common.ts'
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

function addFiles(filesToAdd: FileList,
  setFilesURLs: React.Dispatch<React.SetStateAction<string[]>>,
  files: File[]) {
  for (const file of filesToAdd) files.push(file)
  setFilesURLs((files) => {
    const a = [...files]
    for (const file of filesToAdd) a.push(URL.createObjectURL(file))
    return a
  })
}

function removeFile(fileIdx: number, files: File[],
  setFilesURLs: React.Dispatch<React.SetStateAction<string[]>>) {
  setFilesURLs((filesURLs) => {
    const a = [...filesURLs]
    files.splice(fileIdx, 1)
    URL.revokeObjectURL(a[fileIdx])
    a.splice(fileIdx, 1)
    return a
  })

}

function getValidImageFiles(
  fileItems: Array<File | DataTransferItem>,
  isDragEvent: boolean = false
): FileList {
  const fileList = new DataTransfer()

  fileItems.forEach((item) => {
    let file: File | null

    if (isDragEvent && 'getAsFile' in item) {
      file = item.getAsFile()
    } else if (item instanceof File) {
      file = item
    } else {
      file = null
    }

    if (file && file.type.startsWith('image/')) {
      fileList.items.add(file)
    }
  })

  return fileList.files
}

function useDragAndDrop(setFilesURLs: React.Dispatch<React.SetStateAction<string[]>>, files: File[]) {
  const [isOver, setIsOver] = useState(false)
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsOver(false)
    const validFiles = getValidImageFiles(Array.from(event.dataTransfer.items), true)
    addFiles(validFiles, setFilesURLs, files)
  }

  return {
    handleDragLeave,
    handleDragOver,
    handleDrop,
    isOver
  }

}

function useRecording() {
  const [mediaRecorder, setMediaRecorder] = useState<IMediaRecorder | null>(null)
  const dataRef = useRef<{ audioChunks: Blob[], stream: MediaStream | void }>(
    {audioChunks: [], stream: undefined})
  const startRecording = async () => {
    if (mediaRecorder !== null) return
    dataRef.current.stream = await navigator.mediaDevices.getUserMedia({audio: true}).catch((e) => {
      switch (e.name) {
      case 'NotAllowedError':
        alert('Вы не разрешили использовать микрофон')
        break
      case 'NotFoundError':
        alert('Микрофон не найден')
      }
    })
    if (!dataRef.current.stream) return
    try {
      await register(await connect())
    } catch (e) {
      //todo fixme mb second+ time doing it
    }
    setMediaRecorder(() => {
      const mr = new MediaRecorder(dataRef.current.stream!, {mimeType: 'audio/wav'})
      dataRef.current.audioChunks = []
      mr.ondataavailable = (event) => {
        dataRef.current.audioChunks.push(event.data)
      }
      mr.start()
      return mr
    })
  }

  const stopRecording = async () => {
    if (mediaRecorder === null) return
    dataRef.current.stream!.getTracks().forEach((track) => track.stop())
    const promise = new Promise<File>((resolve) =>
      mediaRecorder!.onstop = () => {
        setMediaRecorder(null)
        resolve(new File(dataRef.current.audioChunks, 'voice.wav', {type: 'audio/wav'}))
      })
    mediaRecorder.stop()
    return await promise
  }

  return {
    isRecording: mediaRecorder !== null,
    startRecording,
    stopRecording,
  }
}


function Chat({addCallbackForCentrifuge, removeCallbackForCentrifuge}: {
  addCallbackForCentrifuge: AddCallbackForCentrifuge,
  removeCallbackForCentrifuge: RemoveCallbackForCentrifuge
}) {
  const navigate = useNavigate()
  const _chatId = useParams<{ chatId: string }>().chatId
  if (!_chatId) {
    navigate(paths.chats)
    //todo Will execution get terminated here?
  }
  const chatId = _chatId as string
  const [data, setData] = useState<Message[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useAutosize(textareaRef)
  useRef<HTMLInputElement & { files: FileList }>(null)
  const [filesURLs, setFilesURLs] = useState<string[]>([])
  const filesRef = useRef([])
  const {handleDragOver, handleDragLeave, handleDrop, isOver} = useDragAndDrop(setFilesURLs, filesRef.current)
  const {isRecording, startRecording, stopRecording: _stopRecording} = useRecording()
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioFileRef = useRef<File | null>(null)
  const [isMessageTextPresent, setIsMessageTextPresent] = useState(false)

  async function sendMessage() {
    await stopRecording()
    if(audioFileRef.current!==null){
      await api('messages/POST', {
        chat: chatId,
        voice: audioFileRef.current
      }, true, true)
      removeRecording()
      return
    }

    if (textareaRef.current === null) return
    const textarea = textareaRef.current
    if (textarea.value.trim().length === 0 && filesRef.current.length === 0) return
    await api('messages/POST', {
      chat: chatId,
      files: filesRef.current,
      text: textarea.value,
    }, true, true)
    setFilesURLs(() => {
      for (let i = 0; i < filesRef.current.length; i++) {
        URL.revokeObjectURL(filesRef.current[i])
      }
      filesRef.current = []
      return []
    })
    textarea.value = ''
    textarea.dispatchEvent(new Event('input', {
      bubbles: true
    }))
  }

  async function stopRecording() {
    const file = await _stopRecording()
    if (file === undefined) return
    audioFileRef.current = file
    setAudioUrl(URL.createObjectURL(file))
  }

  const filesOnChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    if (event!.target!.files === null) return
    const validFiles = getValidImageFiles(Array.from(event.target.files))
    addFiles(validFiles, setFilesURLs, filesRef.current)
  }, [])

  const callbackForCentrifuge = useRef<CallbackForCentrifuge>((data) => {
    console.log(data)
    switch (data.event){
    case 'create':
      break//todo
    case 'update':
      break//todo
    case 'delete':
      break//todo

    }
    if (data.message.chat !== chatId) {
      try{
        if (Notification.permission === 'granted') {
          new Notification('Новое сообщение', {
            body: `У вас новое сообщение в чате: ${data.message.chat}`,
            silent: false,
          })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('Новое сообщение', {
                // todo chat name not id
                body: `У вас новое сообщение в чате: ${data.message.chat}`,
                silent: false,
              })
            }
          })
        }
      } catch (e){
        alert(`У вас новое сообщение в чате: ${data.message.chat}`)
      }

      const sound = new Audio('/notification-sound.wav')
      sound.play().catch(err => console.error('Failed to play sound:', err))

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      } else {
        console.warn('Vibration API is not supported by this device or browser.')
      }
      console.log('done')
    }else {
      setData((prevData) => {
        const t = [...prevData, messageAdapter(data.message)] as MessagesWithNeedsScroll
        return t

      })
    }
  }).current

  const locationOnClick = useRef<React.MouseEventHandler<HTMLSpanElement>>(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords
        api('messages/POST', {chat: chatId, text: `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`})
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

  const removeRecording = () => {
    audioFileRef.current = null
    URL.revokeObjectURL(audioUrl!)
    setAudioUrl(null)
  }

  useEffect(() => {
    const callbackId = addCallbackForCentrifuge(callbackForCentrifuge)
    return () => {
      removeCallbackForCentrifuge(callbackId)
    }
  }, [])

  useEffect(() => {
    (async () =>
      setData(arrayAdapter(
        (await api('messages/GET', {chat: chatId})).results, messageAdapter
      ))
    )()
  }, [])

  return (
    <Screen>
      <Topbar>
        <Link to={paths.chats}><MaterialSymbol symbol="arrow_back"/></Link>
        <Link className={styles.horizontal} to={paths.profile}>
          {/*todo*/}
          <MaterialSymbol symbol="person" hoverable={false}/>
          <div className={styles.vertical}>
            <div className={styles.name}>Дженнифер</div>
            <div className={styles.lastSeen}>была 2 часа назад</div>
          </div>
        </Link>
        <div><MaterialSymbol symbol="search"/>
          <MaterialSymbol symbol="more_vert"/></div>
      </Topbar>
      <ScreenBottom>
        <Messages data={data} onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(styles.FileDrop, {[styles.FileDropHovered]: isOver})}>
          <div className={styles.indicator}>Drop images here to attach</div>
        </Messages>
        {audioUrl && <div className={styles.audio}>
          <audio controls src={audioUrl}/>
          <MaterialSymbol symbol={'delete_forever'} onClick={removeRecording}/>
        </div>}
        <div className={styles.imageAttachments}>
          {filesURLs.length > 0 ? <div>To remove image click it</div> : null}
          <div>{filesURLs.map((fileURL, i) => <img key={fileURL} src={fileURL}
            onClick={() => removeFile(i, filesRef.current, setFilesURLs)}/>)}
          </div>
        </div>
        <div className={styles.form}>
          {(!audioUrl && !isRecording) && <>
            <textarea className={styles.formInput} name="message-text" placeholder="Введите сообщение"
              onKeyUp={(e) => {
                if (
                  e.key !== 'Enter' ||
                  e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
                ) setIsMessageTextPresent(textareaRef.current!.value.trim().length !== 0)
                else sendMessage()
              }} 
              onKeyDown={(e) => {
                if (
                  e.key !== 'Enter' ||
                  e.key === 'Enter' && (e.shiftKey || e.ctrlKey)
                ) return
                e.preventDefault()
              }}     
              ref={textareaRef}></textarea>{/*fixme useAutosize + conditional bug Fix by turning textarea into component*/}
            <label>
              <input type="file" accept="image/*" multiple
                style={{display: 'none'}} onChange={filesOnChange}/>
              <MaterialSymbol symbol="image"/>
            </label>
          </>}
          {(!isMessageTextPresent && filesURLs.length === 0) &&
            <MaterialSymbol symbol={isRecording ? 'stop_circle' : 'mic'}
              onClick={isRecording ? stopRecording : startRecording}/>}
          <MaterialSymbol symbol="location_on" onClick={locationOnClick}/>
          <button onClick={sendMessage}><MaterialSymbol symbol="send"/></button>
        </div>
      </ScreenBottom>
    </Screen>
  )
}

export default Chat
