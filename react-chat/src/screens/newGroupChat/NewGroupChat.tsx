import {useCallback, useEffect, useRef, useState} from 'react'
import Screen from 'screens/Screen.tsx'
import {useFilter} from 'screens/hooks.tsx'
import {api, User} from '~/api.ts'
import styles from './NewGroupChat.module.scss'

const NewGroupChat = () => {
  const [selectedUserIds, setSelectedUserIds] = useState(new Set<User['id']>)
  const [users, setUsers] = useState<User[]>([])
  const [filterString, filterJSX] = useFilter()
  const inputForTitleRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    api('users/GET', {search: filterString}).then(res => {
      setUsers(res.results)
    })
  }, [filterString])
  const create = useCallback(() => {
    api('chats/POST', {is_private:false, members: Array.from(selectedUserIds),title:inputForTitleRef.current?.value??''})
  },[selectedUserIds])
  return <Screen>
    {filterJSX}
    <h1>New group chat</h1>
    <input type="text" required placeholder={'Chat title'} ref={inputForTitleRef}/>
    <div className={styles.users}>
      {users.map((user) =>
        <label className={styles.user} key={user.id}>
          <input type="checkbox" onChange={
            (e) => {
              if (e.target.checked)
                // @ts-expect-error
                setSelectedUserIds((v) => v.union(new Set([user.id])))
              else
                // @ts-expect-error
                setSelectedUserIds((v) => v.difference(new Set([user.id])))
            }
          } checked={selectedUserIds.has(user.id)}/>
          {user.username}
        </label>
      )}
    </div>
    <button onClick={create}>Create</button>
  </Screen>
}

export default NewGroupChat