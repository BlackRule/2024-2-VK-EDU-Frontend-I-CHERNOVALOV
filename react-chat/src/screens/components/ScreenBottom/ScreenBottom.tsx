import cn from 'classnames'
import * as React from 'react'
import {PropsWithChildren} from 'react'
import styles from './ScreenBottom.module.scss'

const ScreenBottom:React.FC<(PropsWithChildren<{className?:string}>)>=({children,className})=>{
  return <div className={cn(className,styles.ScreenBottom)}>{children}</div>
}

export default ScreenBottom