import {Centrifuge} from 'centrifuge'
import {useEffect} from 'react'
import {api} from '~/common.ts'

function useCentrifuge(userId:string|null){

  const useCentrifugeLogger = {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
    log:(...args)=>false&&console.log(...args),
  }
  // отслеживайте, что центрифуга монтируется единожды
  useEffect(() => {
    if (userId === null) {
      useCentrifugeLogger.log('no userId to connect Centrifuge')
      return
    }
    useCentrifugeLogger.log('centrifuge start')


    let centrifuge: Centrifuge | null = null
    let subscription=null
    const init = async () => {
      centrifuge = new Centrifuge('wss://vkedu-fullstack-div2.ru/connection/websocket/', {
        debug: true,
        getToken: (ctx) =>
          new Promise((resolve, reject) =>
            api('centrifugo/connect/POST', ctx)
              .then((data) => resolve(data.token))
              .catch((err) => reject(err))
          )
      })
      subscription = centrifuge.newSubscription(userId, {
        getToken: (ctx) =>
          new Promise((resolve, reject) =>
            api('centrifugo/subscribe/POST', ctx)
              .then((data) => resolve(data.token))
              .catch((err) => reject(err))
          )
      })
      subscription.on('publication', function (ctx) {
      /*
      Данные в канал публикует сервер после создания/изменения/удаления сообщения
      Пример публикации:
       {
        event: "create" | "update" | "delete",
        message: MessageResponse (смотреть GET /api/message/{uuid}/),
      }
     */
        useCentrifugeLogger.log(ctx.data)
      })
      subscription.subscribe()
      centrifuge.connect()
      useCentrifugeLogger.log('centrifuge end')

    }

    init()

    return () => {

      if (centrifuge===null) {
        useCentrifugeLogger.log('no Centrifuge to disconnect ')
        return
      }
      // console.log('uncentrifuge start')
      subscription.unsubscribe()
      subscription.removeAllListeners()
      centrifuge.removeSubscription(subscription)
      centrifuge.disconnect()
      useCentrifugeLogger.log('uncentrifuge end')
    }

  }, [userId])
}