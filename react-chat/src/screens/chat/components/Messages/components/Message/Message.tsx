import {MessageWithIsNew} from 'screens/chat/types.tsx'
import styles from './Message.module.scss'


function Message({isMine,name, time, text, isNew, files, voice}: MessageWithIsNew) {

  return <div className={styles.message + (isMine ? ` ${styles.my}` : '') + (isNew ? ` ${styles.new}` : '')}>
    <div className={styles.top}>
      <div className={styles.name}>{name}</div>
      <div className={styles.time}>{time}</div>
    </div>
    {voice && <audio controls src={voice}/>}
    <div>{files.map((file) => <img key={file.item} src={file.item} alt=""/>)}</div>
    <div className={styles.text}>{text.startsWith('https')?<a href={text}>{text}</a>:text}</div>
  </div>
}

export default Message