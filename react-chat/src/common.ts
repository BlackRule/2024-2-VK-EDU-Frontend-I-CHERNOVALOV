import {ChatProps} from 'screens/chats/components/Chat.tsx'

export const ACCESS_TOKEN_LS_KEY = 'access_token'
export const REFRESH_TOKEN_LS_KEY = 'refresh_token'
export const USER_ID_LS_KEY = 'user_id'
function getCurrentDateTime(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`

}
export type CallbackForCentrifuge = (data: { event:'create' | 'update' | 'delete',message:ApiOutputMap['messages/POST'] }) => void
export type AddCallbackForCentrifuge = (callback: CallbackForCentrifuge) => number
export type RemoveCallbackForCentrifuge = (callbackId: number) => void

let cnt=0
const colors=['#c9578c',
  '#50ac72',
  '#8675ca',
  '#9b9d3f',
  '#c96840']
const API_BASE = 'https://vkedu-fullstack-div2.ru/api'

export type Message = { id:string, name: string, text: string, time: string }
export type User = {
  avatar: string|null,
  bio: string|null,
  first_name: string,
  id: string,
  isOnline: boolean,
  last_name: string,
  last_online_at:string,
  username: string
}
type CreatedUpdatedAt={
  created_at:string,
  updated_at:string
}
type API_MessageCommon = {
  files: {item:string}[],
  id:string,
  text/*todo depends on voice?*/: string,
  voice?:string
}&CreatedUpdatedAt
type API_MessageWithId = {

  id:string,

}&API_MessageCommon
type API_Message =
  API_MessageWithId
  &{sender: User, was_read_by: User[] }
  &CreatedUpdatedAt
type Auth = { access: string, refresh: string };
type UserGetInput={ id: 'current' | string }
type GetInput ={
  page?:number ,
  /*default is 10; max is 100*/page_size?:number ,
  search?:string  }
type AuthPostInput = { password: string, username: string }
type Paginated<T> = {count:number,
next:string|null ,
previous	:string|null,
results:T[]}
type Avatar<T extends File|string>= {avatar?: T}
type ChatCommon =
  //todo title for private chat? :)
  {id:string}&
  ({  is_private: true,title?:never}|
  {  is_private: false,title:string})
type RegisterPostInput={
  bio?:string,
  'first_name': string,
  'last_name': string,
  'password': string,
  'username': string
}
type ChatInput=ChatCommon&{is_private: true,members: [string]}|
{is_private: false, members: string[] }&Avatar<File>
type ChatOutput=object

type ApiInputMap = {
  'auth/POST': AuthPostInput
  'centrifugo/connect/POST': object,
  'centrifugo/subscribe/POST': object,
  'chat/GET': {id:string},
  'chats/GET': GetInput,
  'chats/POST': ChatInput,
  //todo comment before or after?
  'messages/GET':GetInput&{/*chatId*/chat/*chatId*/:string},
  'messages/POST':{
  chat: string,
  files?: File[],
  text?: string,
  voice?: File
},
  'register/POST': RegisterPostInput,
  'user/GET': UserGetInput,
  'users/GET': GetInput
}
export type ApiOutputMap = {
  'auth/POST': Auth
  'centrifugo/connect/POST': {token: 'string'}
  'centrifugo/subscribe/POST': {token: 'string'}
  'chat/GET':Avatar<string> & CreatedUpdatedAt & ChatCommon &
    {
      creator: User,
      last_message: object
    } & { members: User[] },
  'chats/GET': Paginated<Avatar<string> & CreatedUpdatedAt & ChatCommon &
    {
      creator: User,
      last_message: API_Message
    } & { members: User[] }>,
  'chats/POST': ChatOutput,
  'messages/GET':Paginated<API_Message>,
  'messages/POST':{ chat: string}&API_MessageWithId,
  'register/POST': User,
  'user/GET': User,
  'users/GET': Paginated<User>,

  

}

export async function api<K extends keyof ApiInputMap>(
  url: K,
  data: ApiInputMap[K],log=false
): Promise<ApiOutputMap[K]> {
  /* global RequestInit */
  const init: RequestInit = {
    headers: {
      'Content-Type': 'application/json',/*или 'multipart/form-data'*/
    }
  }
  init.method=url.match(/GET|POST/)![0]
  if(url!=='auth/POST')
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  /* @ts-expect-error */
    init.headers.Authorization= `Bearer ${localStorage.getItem(ACCESS_TOKEN_LS_KEY)}`
     
    
  let url_ = url.replace(/(GET|POST)/, '')
  url_= `${API_BASE}/${url_}`
  if('id' in data){
    url_+=`${data.id}/`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete data.id
  }
  if(init.method==='GET') url_+=`?${new URLSearchParams(data)}`
  if(init.method==='POST'||init.method==='PUT'||init.method==='PATCH')
    init.body = JSON.stringify(data)
  if(log) {
    console.groupCollapsed('%csent', `color: white; background-color: ${colors[cnt % colors.length]}`, cnt, getCurrentDateTime(), url)
    console.trace(init)
    console.groupEnd()
  }
  const promise = fetch(url_, init)
    .then(res => {
      return res.json()
    })
  if(log) {
    promise.then((cnt => (r => {
      console.groupCollapsed('%creceived', `color: white; background-color: ${colors[cnt % colors.length]}`, cnt, getCurrentDateTime(), url)
      console.log(r)
      console.groupEnd()
    }))(cnt))
  }
  cnt++
  return promise.catch(e => {
    debugger
    return {}
  })

}

export function f(v: ApiOutputMap['chats/GET']['results']): ChatProps[] {
  const r: ChatProps[] = []
  for (const vElement of v) {
    r.push({
      
      
      
      id: vElement.id,
      


      name: vElement.title ?? 'UNDEFINED',
      // count:/*todo*/0,
      // image:/*todo*/'',
      // image_attachment_alt:/*todo*/'',
      state:/*todo*/'unread',
      text: vElement.last_message.text,
      time:/*todo*/'TIME'
    })
  }
  return r
}

export function f2(v: ApiOutputMap['messages/GET']['results']): Message[] {
  const r: Message[] = []
  for (const vElement of v) {
    r.push({
      id: vElement.id,
      name: vElement.sender.username,
      text: vElement.text,
      time: vElement.created_at
    })
  }
  return r
}

export function f3(v: ApiOutputMap['messages/POST'],name:Message['name']): Message {
  return {
    id: v.id,
    name: name,
    text: v.text,
    time: v.created_at
  }
}