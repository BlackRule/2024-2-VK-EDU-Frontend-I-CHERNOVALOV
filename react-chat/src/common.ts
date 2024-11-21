import {ChatProps} from 'screens/chats/components/Chat.tsx'
import {API_Message, ApiOutputMap} from './api'

export const ACCESS_TOKEN_LS_KEY = 'access_token'
export const REFRESH_TOKEN_LS_KEY = 'refresh_token'
export const USER_ID_LS_KEY = 'user_id'

export type Message = { id:string, isMine?:boolean, name: string, text: string, time: string }

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



export function arrayAdapter<I,O,T=(v:I)=>O>(array:I[],elementAdapter:T): O[] {
  const r: O[] = []
  for (const el of array) {
    //todo
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    r.push(elementAdapter(el))
  }
  return r
}

export function messageAdapter(v: API_Message): Message {
  return {
    id: v.id,
    isMine: v.sender.id===localStorage.getItem(USER_ID_LS_KEY),
    name: v.sender.username,
    text: v.text,
    time: v.created_at
  }
}