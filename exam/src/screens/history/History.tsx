import {useNavigate} from 'react-router-dom'
import {useShallow} from 'zustand/react/shallow'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import {paths} from '~/App.tsx'
import {useAppStore} from '~/store.ts'
import styles from './History.module.scss'

function History() {
  const navigate=useNavigate()
  const history = useAppStore( useShallow((state) =>state.history))
    
  return <>History
    <button onClick={() => navigate(paths.translate)}><MaterialSymbol symbol="arrow_back" className={styles.compose}/>
    </button>
    {history.map((item) => 
      <div key={`${item.l1}${item.l2}${item.i}`}>
        <div>{item.l1}-&gt;{item.l2}</div>
        <div>{item.i}</div>
        <div>{item.o}</div>
      </div>
    )}
  </>
}

export default History