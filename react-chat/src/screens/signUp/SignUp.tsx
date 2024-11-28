import {useNavigate} from 'react-router-dom'
import SignInUpCommon from 'screens/components/SignInUpCommon/SignInUpCommon.tsx'
import Screen from 'screens/Screen.jsx'
import {paths} from '~/App.tsx'
import { api } from '~/api'
import styles from './SignUp.module.scss'

const SignUp =  () => {
  const navigate=useNavigate()
  const onSubmit: React.FormEventHandler<HTMLFormElement>=async (e) => {
    e.preventDefault()
    const username=(e.currentTarget.elements[0] as HTMLInputElement).value
    const password=(e.currentTarget.elements[1] as HTMLInputElement).value
    const first_name=(e.currentTarget.elements[2] as HTMLInputElement).value
    const last_name=(e.currentTarget.elements[3] as HTMLInputElement).value
    const bio=(e.currentTarget.elements[4] as HTMLTextAreaElement).value
    await api('register/POST',{bio,first_name,last_name,password,username})
    navigate(paths.signIn)
  }
  return <SignInUpCommon>
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="username" required/>
      <input type="password" placeholder="password" required autoComplete="new-password"/>
      <input type="text" placeholder="first name" required/>
      <input type="text" placeholder="last name" required/>
      <textarea placeholder="bio"></textarea>
      <input type="submit"/>
    </form>
  </SignInUpCommon>
}

export default SignUp