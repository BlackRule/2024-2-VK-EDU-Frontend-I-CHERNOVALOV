import {useCallback, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {paths} from '~/App.tsx'
import {ACCESS_TOKEN_LS_KEY, api, REFRESH_TOKEN_LS_KEY, USER_ID_LS_KEY} from '~/common.ts'
import styles from './SignIn.module.scss'

const SignIn: React.FC<{ setUserId: React.Dispatch<React.SetStateAction<string | null>> }> =
  ({setUserId}) => {
    const navigate = useNavigate()
    const signIn = useRef(async (n: 0|1) => {
      const data = [
        {password: 'user101password', username: 'user101'},
        {password: 'user102password', username: 'user102'},
      ]
      const auth = await api('auth/POST', {password: data[n].password, username: data[n].username})
      localStorage.setItem(ACCESS_TOKEN_LS_KEY, auth.access)
      localStorage.setItem(REFRESH_TOKEN_LS_KEY, auth.refresh)
      const user = await api('user/GET', {id:'current'})
      localStorage.setItem(USER_ID_LS_KEY, String(user.id))
      setUserId(user.id)
      navigate(paths.chats)
    }).current

    return <div className={styles.SignIn}>
      <button onClick={() => signIn(0)}>Sign in as User1</button>
      <button onClick={() => signIn(1)}>Sign in as User2</button>
    </div>
  }

export default SignIn