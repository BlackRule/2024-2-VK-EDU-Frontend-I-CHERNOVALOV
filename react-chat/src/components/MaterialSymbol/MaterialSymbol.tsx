import cn from 'classnames'
import {MouseEventHandler} from 'react'
import styles from './MaterialSymbol.module.scss'

type Symbol = 'arrow_back' | 'person' | 'send' | 'attachment' | 'more_vert' | 'search' | 'menu' | 'edit' | 'check' | 'done_all' | 'photo_camera';

//todo have EITHER onClick or href NOT  BOTH
const MaterialSymbol = ({symbol, hoverable = true, ...props}:
  {
    className?: string, hoverable?: boolean, href?: string,
    onClick?: MouseEventHandler<HTMLAnchorElement>, symbol: Symbol
  }
) => {
  return <a className={cn('material-symbols-outlined',
    styles.materialSymbolsOutlined, {[styles.hoverable]: hoverable}, props.className
  )}
  {...('href' in props ? {href: props.href} : {onClick: props?.onClick})}
  >{symbol}</a>
}

export default MaterialSymbol