import {useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Screen from 'screens/Screen.tsx'
import {useFilter} from 'screens/hooks.tsx'
import {paths} from '~/App.tsx'
import {api, User} from '~/api.ts'
import styles from './NewChat.module.scss'

const NewChat = () => {
  const [users, setUsers] = useState<User[]>([])
  const navigate = useNavigate()
  const [filterString, filterJSX] = useFilter()
  useEffect(() => {
    api('users/GET', {search: filterString}).then(res => {
      setUsers(res.results)
    })
  }, [filterString])
  const create = useRef(async (userId:string) => {
    await api('chats/POST', {is_private:true,members:[userId]})
    navigate(paths.chats)
  }).current
  return <Screen>
    <Link to={paths.newGroupChat}>newGroupChat</Link>
    {filterJSX}
    <div className={styles.users}>
      {users.map((user) =>
        <div className={styles.user} key={user.id} onClick={()=>create(user.id)}>
          {user.username}
        </div>
      )}
    </div>
  </Screen>
}

export default NewChat