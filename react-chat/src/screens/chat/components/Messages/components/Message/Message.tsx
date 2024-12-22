import {MessageWithIsNew} from 'screens/chat/types.tsx'
import styles from './Message.module.scss'


function Message({isMine,name, time, text, isNew, files}: MessageWithIsNew) {

  return <div className={styles.message + (isMine ? ` ${styles.my}` : '') + (isNew ? ` ${styles.new}` : '')}>
    <div className={styles.top}>
      <div className={styles.name}>{name}</div>
      <div className={styles.time}>{time}</div>
    </div>
    <div>{files.map((file) => <img key={file.item} src={file.item} alt=""/>)}</div>
    <div className={styles.text}>{text}</div>
  </div>
}

export default Message