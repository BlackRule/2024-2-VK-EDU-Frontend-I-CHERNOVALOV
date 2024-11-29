import Screen from 'screens/Screen.tsx'
import styles from './SignInUpCommon.module.scss'

const SignInUpCommon:React.FC<React.PropsWithChildren> =  (props) => {

  return <Screen className={styles.SignInUpCommon}>
    {props.children}
  </Screen>
}
export default SignInUpCommon