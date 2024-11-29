import cn from 'classnames'
import {useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {paths} from '~/App.tsx'
import {ACCESS_TOKEN_LS_KEY} from '~/common.ts'
import styles from './Screen.module.scss'

const Screen:React.FC<(React.PropsWithChildren<{className?: string}>)>=(props)=> {
  const navigate=useNavigate()
  const location=useLocation()
  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN_LS_KEY)===null&&location.pathname!==paths.signUp)
      navigate(paths.signIn)
  }, [navigate])
  return (
    <div className={cn(styles.screen,props.className)}>
      <div><Link to={paths.signIn}>SignIn</Link>&nbsp;&nbsp;&nbsp;
        <Link to={paths.signUp}>SignUp</Link>&nbsp;&nbsp;&nbsp;
        <Link to={paths.chats}>Chats</Link></div>
      {props.children}
    </div>
  )
}

export default Screen
