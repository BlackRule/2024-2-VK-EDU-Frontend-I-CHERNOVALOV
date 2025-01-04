import cn from 'classnames'
import {RefObject, useEffect, useRef} from 'react'
import {MessagesWithNeedsScroll} from 'screens/chat/types.tsx'
import Message from './components/Message/Message.tsx'
import styles from './Messages.module.scss'

//fixme browser is triggering scroll before resize. That scroll needs to be ignored
function useKeepScrollPositionOnResize(scrollableRef: RefObject<HTMLDivElement>) {
  const scrollPercentRef = useRef<number | null>(null)
  useEffect(() => {
    const scrollListener = () => {
      if (scrollableRef.current === null) return
      const scrollable = scrollableRef.current
      scrollPercentRef.current = scrollable.scrollTop / scrollable.scrollHeight
    }
    if (scrollableRef.current === null) return
    const scrollable = scrollableRef.current
    scrollable.scrollTop = scrollable.scrollHeight
    scrollable.addEventListener('scroll', scrollListener)
    const resizeObserver = new ResizeObserver(() => {
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

const Messages = ({data,...rest}: { data: MessagesWithNeedsScroll }&React.HTMLAttributes<HTMLDivElement>) => {
  const messagesScrollableRef = useRef<HTMLDivElement>(null)
  useKeepScrollPositionOnResize(messagesScrollableRef)

  useEffect(() => {
    if (!data.needsScroll) return
    data.needsScroll = false
    if (messagesScrollableRef.current === null) return
    const messagesScroll = messagesScrollableRef.current
    messagesScroll.scrollTop = messagesScroll.scrollHeight
  }, [data])


  return <div {...rest} className={cn(styles['messages-scroll'],rest.className)} ref={messagesScrollableRef}>
    <div className={styles.messages}>
      {data.map((message) => {
        message = {...message}
        return <Message key={message.id} {...message}
          isNew={data.length !== 0 && data.needsScroll && message.id === data[data.length - 1].id}
        />
      })}
    </div>
    {rest.children}
  </div>
}

export default Messages