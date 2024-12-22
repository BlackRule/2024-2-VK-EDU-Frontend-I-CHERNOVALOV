import * as rt from 'runtypes'
import {Static} from 'runtypes'
import {FileRt, gen_ApiOutputMap} from '~/api_generated.ts'
import {ACCESS_TOKEN_LS_KEY} from '~/common.ts'
import {DistributiveOmit} from '~/ts workarounds.ts'

export type CallbackForCentrifuge = (data: {
  event: 'create' | 'update' | 'delete',
  message: ApiOutputMap['messages/POST']
}) => void
export type AddCallbackForCentrifuge = (callback: CallbackForCentrifuge) => number
export type RemoveCallbackForCentrifuge = (callbackId: number) => void

function getCurrentDateTime(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`

}

let cnt = 0
const colors = ['#c9578c',
  '#50ac72',
  '#8675ca',
  '#9b9d3f',
  '#c96840']
const API_BASE = 'https://vkedu-fullstack-div2.ru/api'
export type PartialPick<T, F extends keyof T> = DistributiveOmit<T, F> & Partial<Pick<T, F>>;
export type User = {
  avatar: string,
  bio: string,
  first_name: string,
  id: string,
  is_online: boolean,
  last_name: string,
  last_online_at: string,
  username: string
}
export type UserOptional = PartialPick<User, 'avatar' | 'bio'>
type CreatedUpdatedAt = {
  created_at: string,
  updated_at: string|null
}
export type API_MessageCommon = {
  files: Static<typeof FileRt>[],
  id: string,
  text/*todo depends on voice?*/: string,
  voice: string|null/*todo NoVoiceMessage must contain text !*/
} & CreatedUpdatedAt
type API_MessageWithId = { id: string, } & API_MessageCommon
export type API_Message =
  API_MessageWithId
  & { sender: User, was_read_by: User[]|null }
  & CreatedUpdatedAt
type UserGetInput = { id: 'current' | string }
type GetInput = {
  page?: number,
  /*default is 10; max is 100*/page_size?: number,
  search?: string
}
type AuthPostInput = { password: string, username: string }
type Paginated<T> = {
  count: number,
  next?: string,
  previous?: string,
  results: T[]
}
type Avatar<T extends File | string> = { avatar?: T }
type ChatCommon =
//todo title for private chat? :)
  { id: string } &
  ({ is_private: true, title?: never } |
    { is_private: false, title: string })
type RegisterPostInput = {
  bio?: string,
  'first_name': string,
  'last_name': string,
  'password': string,
  'username': string
}

type ChatInput = DistributiveOmit<ChatCommon,'id'> & ({ is_private: true, members: [string] } |
  { is_private: false, members: string[] }) & Avatar<File>
type ChatOutput = object

export type ApiInputMap = {
  'auth/POST': AuthPostInput
  'centrifugo/connect/POST': object,
  'centrifugo/subscribe/POST': object,
  'chat/GET': { id: string },
  'chats/GET': GetInput,
  'chats/POST': ChatInput,
  //todo comment before or after?
  'messages/GET': GetInput & {/*chatId*/chat/*chatId*/: string },
  'messages/POST': {
    chat: string,
    files?: FileList|null,
    text?: string,
    voice?: File
  },
  'register/POST': RegisterPostInput,
  'user/GET': UserGetInput,
  'users/GET': GetInput
}
export type ApiOutputMap = {
  'auth/POST': Static<typeof gen_ApiOutputMap['auth/POST']>
  'centrifugo/connect/POST': Static<typeof gen_ApiOutputMap['centrifugo/connect/POST']>
  'centrifugo/subscribe/POST': Static<typeof gen_ApiOutputMap['centrifugo/subscribe/POST']>
   'chat/GET':
   Avatar<string> & CreatedUpdatedAt & ChatCommon &
    {
      creator: User,
      last_message: object
    } & { members: User[] }
  ,
  'chats/GET': Static<typeof gen_ApiOutputMap['chats/GET']>
    /*Paginated<Avatar<string> & CreatedUpdatedAt & ChatCommon &
    {
      creator: User,
      last_message: API_Message
    } & { members: User[] }>*/
  ,
  'chats/POST': ChatOutput,
  'messages/GET': Static<typeof gen_ApiOutputMap['messages/GET']>
  /*Paginated<API_Message>*/
  ,
  'messages/POST': Static<typeof gen_ApiOutputMap['messages/POST']>
  /*{ chat: string } & API_Message*/
  ,
  'register/POST': User,
  'user/GET': Static<typeof gen_ApiOutputMap['user/GET']>
  /*UserOptional*/
  ,
  'users/GET': Paginated<User>,
}


export async function api<K extends keyof ApiInputMap>(
  intent: K,
  data: ApiInputMap[K], logSend = false,logReceive = false
): Promise<ApiOutputMap[K]> {
  /* global RequestInit */
  const init: RequestInit = {
    headers: 'files' in data?
      {}
      :
      {
      'Content-Type': 'application/json',
    }
  }
  init.method = intent.match(/GET|POST/)![0]
  if (intent !== 'auth/POST')
    /* @ts-expect-error */
    init.headers.Authorization = `Bearer ${localStorage.getItem(ACCESS_TOKEN_LS_KEY)}`


  let url = intent.replace(/(GET|POST)/, '')
  url = `${API_BASE}/${url}`
  if ('id' in data) {
    url += `${data.id}/`
    // @ts-expect-error
    delete data.id
  }
  //todo
  if (init.method === 'GET') { // @ts-expect-error
    url += `?${new URLSearchParams(data)}`
  }
  // Максимальный размер body реквеста - 10MB
  if('files' in data && data.files){
    init.body=new FormData()
    for (const dataKey in data) {
      if (dataKey === 'files') continue
      // @ts-expect-error
      init.body.append(dataKey, data[dataKey])
    }
    for (const file of data.files) {
      init.body.append('files', file)
    }

  }
  else if (init.method === 'POST' || init.method === 'PUT' || init.method === 'PATCH')
    init.body = JSON.stringify(data)
  if(logSend) {
    console.groupCollapsed('%csent', `color: white; background-color: ${colors[cnt % colors.length]}`, cnt, getCurrentDateTime(), intent)
    console.trace(init)
    console.groupEnd()
  }
  const promise = fetch(url, init)
    .then(res => {
      return res.json()
    })
  if (logReceive) {
    promise.then((cnt => (r => {
      console.groupCollapsed('%creceived', `color: white; background-color: ${colors[cnt % colors.length]}`, cnt, getCurrentDateTime(), intent)
      console.log(r)
      console.groupEnd()
    }))(cnt))
    cnt++
  }
  promise.then(r => {
    try {
      // @ts-expect-error
      gen_ApiOutputMap[intent].check(r)
    } catch (e) {
      console.warn(intent,e)
    }
  })
  return promise

}