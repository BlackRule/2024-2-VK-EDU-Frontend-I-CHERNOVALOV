import {useNavigate} from 'react-router-dom'
import {useShallow} from 'zustand/react/shallow'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import {paths} from '~/App.tsx'
import {languages}  from '~/languages'
import {useAppStore} from '~/store.ts'
import styles from './History.module.scss'


function History() {
  const navigate=useNavigate()
  const history = useAppStore( useShallow((state) =>state.history))
    
  return <div className={styles.body}>
    <div className={styles.top}>
      <span>History</span>
      <button onClick={() => navigate(paths.translate)}><MaterialSymbol symbol="arrow_back" className={''}/>
      </button>
    </div>
    <div className={styles.bottom}>
      {history.map((item,index) =>
        <div key={`${item.l1}${item.l2}${item.i}${index}`} className={styles.entry}>
          {/* todo item.l1 when was autodetected */}
          <div>{item.l1}-&gt;{languages[item.l2]}</div>
          <div>{item.i}</div>
          <div>{item.o}</div>
        </div>
      )}
    </div>
  </div>
}

export default History