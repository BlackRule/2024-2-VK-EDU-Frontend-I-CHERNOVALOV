import {useEffect, useRef, useState} from 'react'
import Screen from 'screens/Screen.tsx'
import {api, User} from '~/common.ts'
import styles from './NewGroupChat.module.scss'

const NewGroupChat = () => {
  const selectedUserIds = useRef(new Set<User['id']>).current
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    api('users/GET', {search: 'user10'}).then(res => {
      setUsers(res.results)
    })
  }, [])
  const create = useRef(() => {
    api('chats/POST', {is_private:false, members: Array.from(selectedUserIds)})
  }).current
  return <Screen>
    <div className={styles.users}>
      {users.map((user) =>
        <label className={styles.user} key={user.id}>
          <input type="checkbox" onChange={
            (e) => {
              if (e.target.checked)
                selectedUserIds.add(user.id)
              else
                selectedUserIds.delete(user.id)
            }
          }/>
          {user.username}
        </label>
      )}
    </div>
    <button onClick={create}>Create</button>
  </Screen>
}

export default NewGroupChat