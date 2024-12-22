import cn from 'classnames'
import {Link} from 'react-router-dom'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import {paths} from '~/App.tsx'
import {Message} from '~/common.ts'
import {DistributiveOmit} from '~/ts workarounds.ts'
import styles from './Chat.module.scss'


export type ChatProps = DistributiveOmit<Message, 'text'|'files'>
  & { has_image_attachment:boolean,image: string|null,text: Message['text'] }
  & ({ count?: never, state: 'unread' | 'read', } | { count: number, state: 'new' | 'mention', })

function Chat({name, time, state, image, count, id, has_image_attachment,text}: ChatProps) {
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
  return <>
    <Link className={styles.chat} to={paths.chat(id)}>
      {image?<img src={image} alt="avatar"/>:<MaterialSymbol symbol='person' hoverable={false}/>}
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.name}>{name}</div>
          <div className={styles.time}>{time}</div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.text}>{has_image_attachment&&<MaterialSymbol symbol='photo_camera' hoverable={false} className={styles.photo_camera}/>}{text}</div>
          {badge}
        </div>
      </div>
    </Link>
  </>
}

export default Chat