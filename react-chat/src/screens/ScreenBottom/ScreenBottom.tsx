import styles from './ScreenBottom.module.scss'
import * as React from "react";
import {PropsWithChildren} from "react";

const ScreenBottom:React.FC<PropsWithChildren>=({children})=>{
  return <div className={styles.ScreenBottom}>{children}</div>
}

export default ScreenBottom