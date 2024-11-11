import {Link} from 'react-router-dom'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import Topbar from 'components/Topbar/Topbar.tsx'
import Screen from 'screens/Screen.tsx'
import ScreenBottom from 'screens/ScreenBottom/ScreenBottom.tsx'
import {paths} from '~/App.tsx'
import styles from './Profile.module.scss'

const Profile = () => {
  return <Screen>
    <Topbar>
      <Link to={paths.chats}><MaterialSymbol symbol='arrow_back'/></Link>
      <div>
          Edit Profile
      </div>
      <MaterialSymbol symbol='check' />
    </Topbar>
    <ScreenBottom className={styles.screenBottom}>
      <div className={styles.photo} style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)),url(chat_images/5.png)'
      }}>
        <MaterialSymbol symbol={'photo_camera'}/>
      </div>
      <div className={styles.field}>
        <label htmlFor="">Full name</label>
        <input type="text" value={'Tony Jackobson'}/>
        <div className={styles.hint}></div>
      </div>
      <div className={styles.field}>
        <label htmlFor="">Username</label>
        <span>@<input type="text" value={'tony'}/></span>
        <div className={styles.hint}>Minimum length is 5 characters</div>
      </div>
      <div className={styles.field}>
        <label htmlFor="">Bio</label>
        <textarea value={'Subtitle 1'} rows={4} />
        <div className={styles.hint}>Any details about you</div>
      </div>
    </ScreenBottom>
  </Screen>
}

export default Profile