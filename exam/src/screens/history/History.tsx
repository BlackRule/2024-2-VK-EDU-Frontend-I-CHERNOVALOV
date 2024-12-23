import {useNavigate} from 'react-router-dom'
import MaterialSymbol from 'components/MaterialSymbol/MaterialSymbol.tsx'
import {paths} from '~/App.tsx'
import styles from './History.module.scss'

function History() {
  const navigate=useNavigate()
  return <>History
    <button onClick={() => navigate(paths.translate)}><MaterialSymbol symbol="arrow_back" className={styles.compose}/>
    </button>
  </>
}

export default History