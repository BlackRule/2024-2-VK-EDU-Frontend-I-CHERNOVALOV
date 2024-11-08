import {RefObject, useEffect, useRef} from 'react'
import {ArrayOfMessagePropsWithNeedsScroll} from 'screens/chat/types.tsx'
import Message from './components/Message/Message.tsx'
import styles from './Messages.module.scss'

//fixme browser is triggering scroll before resize. That scroll needs to be ignored
//  Оно ведь работало но мне к сожалению никто не поверит.  я сам себе не верю ведь не работает теперь
function useKeepScrollPositionOnResize(scrollableRef: RefObject<HTMLDivElement>) {
  const scrollPercentRef = useRef<number | null>(null)
  useEffect(() => {
    const scrollListener = () =>{
      console.log('scroll')
      if (scrollableRef.current === null) return
      const scrollable = scrollableRef.current
      scrollPercentRef.current = scrollable.scrollTop / scrollable.scrollHeight
    }
    if (scrollableRef.current === null) return
    const scrollable = scrollableRef.current
    scrollable.scrollTop = scrollable.scrollHeight
    scrollable.addEventListener('scroll', scrollListener)
    const resizeObserver=new ResizeObserver(() => {
      console.log('resize')
      if (scrollPercentRef.current === null) return
      const percent = scrollPercentRef.current
      if (scrollableRef.current === null) return
      const scrollable = scrollableRef.current
      scrollable.scrollTop = scrollable.scrollHeight * percent
    })
    resizeObserver.observe(scrollable)
    return () => {
      scrollable.removeEventListener('scroll', scrollListener)
      resizeObserver.unobserve(scrollable)
    }
  }, [scrollableRef])

}

const Messages = ({data}: { data: ArrayOfMessagePropsWithNeedsScroll }) => {
  const messagesScrollableRef = useRef<HTMLDivElement>(null)
  useKeepScrollPositionOnResize(messagesScrollableRef)

  useEffect(() => {
    if (!data.needsScroll) return
    data.needsScroll = false
    if (messagesScrollableRef.current === null) return
    const messagesScroll = messagesScrollableRef.current
    messagesScroll.scrollTop = messagesScroll.scrollHeight
  }, [data])


  return <div className={styles['messages-scroll']} ref={messagesScrollableRef}>
    <div className={styles.messages}>
      {data.map((message) =>
        <Message key={message.id} {...message}/>)}
    </div>
  </div>
}

export default Messages