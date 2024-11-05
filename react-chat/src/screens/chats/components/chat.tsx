import './chat.css'
import {Message, SwitchScreenTo} from '@/types.ts'


type ChatProps = Omit<Message,'text'>&{
    count?: number,
    image: string,
    state: string,
    switchScreenTo: SwitchScreenTo,
} & (
    { text: string }
    |
    { image_attachment_alt: string }
    )

function Chat({name, time, state, image, count, switchScreenTo, id, ...props}: ChatProps) {
  let badge = null
  switch (state) {
  case 'new':
    badge = <div className="badge new">{count}</div>
    break
  case 'unread':
    badge = <span className="badge unread material-symbols-outlined">done_all</span>
    break
  case 'read':
    badge = <span className="badge read material-symbols-outlined">check</span>
    break
  case 'mention':
    badge = <div className="badge mention">{count}</div>
  }
  let text
  if ('image_attachment_alt' in props)
    text = <><span className="material-symbols-outlined"
      style={{color: '#50b052'}}>photo_camera</span> {props.image_attachment_alt}</>
  else text = props.text
  return <>
    <a className="chat" onClick={(e) => {
      switchScreenTo('chat')
      e.preventDefault()
    }}>
      <img src={image} alt="avatar"/>
      <div className="body">
        <div className="top">
          <div className="name">{name}</div>
          <div className="time">{time}</div>
        </div>
        <div className="bottom">
          <div className="text">{text}</div>
          {badge}
        </div>
      </div>
    </a>
  </>
}

export default Chat