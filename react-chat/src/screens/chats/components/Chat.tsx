import cn from 'classnames'
import {Link} from 'react-router-dom'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import {paths} from '~/App.tsx'
import {Message} from '~/common.ts'
import styles from './Chat.module.scss'


export type ChatProps = Omit<Message, 'text'>
  & { image?: string, }
  & ({ count?: never, state: 'unread' | 'read', } | { count: number, state: 'new' | 'mention', })
  & ({ image_attachment_alt?:never,text: Message['text'] } | { image_attachment_alt: string,text?:never })

function Chat({name, time, state, image, count, id, image_attachment_alt,text}: ChatProps) {
  let badge = null
  switch (state) {
  case 'new':
    badge = <div className={cn(styles.badge, styles.new)}>{count}</div>
    break
  case 'unread':
    badge = <MaterialSymbol symbol='check' className={cn(styles.badge, styles.unread)}/>
    break
  case 'read':
    badge = <MaterialSymbol symbol='done_all' className={cn(styles.badge, styles.read)}/>
    break
  case 'mention':
    badge = <div className={cn(styles.badge, styles.mention)}>{count}</div>
  }
  let text_
  if (image_attachment_alt)
    text_ = <>
      <MaterialSymbol symbol='photo_camera' hoverable={false} className={styles.photo_camera}/>
      {image_attachment_alt}
    </>
  if (text) text_ = text
  return <>
    <Link className={styles.chat} to={paths.chat(id)}>
      {image?<img src={image} alt="avatar"/>:<MaterialSymbol symbol='person' hoverable={false}/>}
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.name}>{name}</div>
          <div className={styles.time}>{time}</div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.text}>{text_}</div>
          {badge}
        </div>
      </div>
    </Link>
  </>
}

export default Chat