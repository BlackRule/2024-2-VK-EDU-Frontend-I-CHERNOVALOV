import cn from 'classnames'
import styles from './MaterialSymbol.module.scss'

type Symbol = 'arrow_back' | 'person' | 'send' | 'attachment' | 'more_vert' | 'search' | 'menu' | 'edit' | 'check' |
  'done_all' | 'photo_camera';

const MaterialSymbol = ({symbol, hoverable = true, ...props}:
  { className?: string, hoverable?: boolean,symbol: Symbol}) => {
  const className = cn('material-symbols-outlined',
    styles.materialSymbolsOutlined, {[styles.hoverable]: hoverable}, props.className)
  return <span className={className}>{symbol}</span>
}

export default MaterialSymbol