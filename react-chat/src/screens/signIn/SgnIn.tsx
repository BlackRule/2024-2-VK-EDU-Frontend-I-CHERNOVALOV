import {useNavigate} from 'react-router-dom'
import SignInUpCommon from 'screens/components/SignInUpCommon/SignInUpCommon.tsx'
import Screen from 'screens/Screen.jsx'
import {paths} from '~/App.tsx'
import { api } from '~/api'
import {ACCESS_TOKEN_LS_KEY, REFRESH_TOKEN_LS_KEY, USER_ID_LS_KEY} from '~/common.ts'
import styles from './SignIn.module.scss'

const SignIn: React.FC<{ setUserId: React.Dispatch<React.SetStateAction<string | null>> }> =
  ({setUserId}) => {
    const navigate=useNavigate()
    const onSubmit: React.FormEventHandler<HTMLFormElement>=async (e) => {
      e.preventDefault()
      const username=(e.currentTarget.elements[0] as HTMLInputElement).value
      const password=(e.currentTarget.elements[1] as HTMLInputElement).value
      const auth = await api('auth/POST',{password,username})
      localStorage.setItem(ACCESS_TOKEN_LS_KEY, auth.access)
      localStorage.setItem(REFRESH_TOKEN_LS_KEY, auth.refresh)
      const user = await api('user/GET', {id:'current'})
      localStorage.setItem(USER_ID_LS_KEY, String(user.id))
      setUserId(user.id)
      navigate(paths.chats)
    }
    return <SignInUpCommon>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="username" required/>
        <input type="password" placeholder="password" required autoComplete="current-password"/>
        <input type="submit"/>
      </form>
    </SignInUpCommon>
  }

export default SignIn