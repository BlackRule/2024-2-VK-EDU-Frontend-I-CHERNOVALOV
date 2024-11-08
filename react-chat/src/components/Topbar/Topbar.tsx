import styles from './Topbar.module.scss'

const Topbar: React.FC<React.PropsWithChildren> = (props) => {
  return <div className={styles.topbar}>
    {props.children}
  </div>
}

export default Topbar