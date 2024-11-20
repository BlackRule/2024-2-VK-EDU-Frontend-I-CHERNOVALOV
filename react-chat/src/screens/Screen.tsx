import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {paths} from '~/App.tsx'
import {ACCESS_TOKEN_LS_KEY} from '~/common.ts'
import styles from './Screen.module.scss'

const Screen:React.FC<React.PropsWithChildren>=(props)=> {
  const navigate=useNavigate()
  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN_LS_KEY)===null)
      navigate(paths.signIn)
  }, [navigate])
  return (
    <div className={styles.screen}>
      {props.children}
    </div>
  )
}

export default Screen
