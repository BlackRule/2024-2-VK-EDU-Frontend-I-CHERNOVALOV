import cn from 'classnames'
import styles from './MaterialSymbol.module.scss'

type Symbol = 'arrow_back' | 'person' | 'send' | 'attachment' | 'more_vert' | 'search' | 'menu' | 'edit' | 'check' |
  'done_all' | 'photo_camera' | 'location_on' | 'image' | 'swap_horiz' | 'history';

const MaterialSymbol = ({symbol, hoverable = true, ...props}:
  { hoverable?: boolean, symbol: Symbol } & React.HTMLAttributes<HTMLSpanElement>) => {
  const className = cn('material-symbols-outlined',
    styles.materialSymbolsOutlined, {[styles.hoverable]: hoverable}, props.className)
  return <span {...props} className={className}>{symbol}</span>
}

export default MaterialSymbol