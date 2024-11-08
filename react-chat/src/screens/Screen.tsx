import styles from './Screen.module.scss'
const Screen:React.FC<React.PropsWithChildren>=(props)=> {
  return (
    <div className={styles.screen}>
      {props.children}
    </div>
  )
}

export default Screen
