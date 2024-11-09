import cn from 'classnames'
import {MouseEventHandler} from 'react'
import styles from './MaterialSymbol.module.scss'

type Symbol = 'arrow_back' | 'person' | 'send' | 'attachment' | 'more_vert' | 'search' | 'menu' | 'edit' | 'check' | 'done_all' | 'photo_camera';

const MaterialSymbol = ({symbol, hoverable = true, ...props}:
  { className?: string, hoverable?: boolean,symbol: Symbol } &
  ({ href: string,onClick?:never}|{href?:never,onClick: MouseEventHandler<HTMLButtonElement>}|{href?:never,onClick?:never})) => {
  const className = cn('material-symbols-outlined',
    styles.materialSymbolsOutlined, {[styles.hoverable]: hoverable}, props.className)
  if ('href' in props )
    return <a className={className} href={props.href}>{symbol}</a>
  return <button className={className} onClick={props.onClick}>{symbol}</button>
}

export default MaterialSymbol