import {ChatProps} from 'screens/chats/components/Chat.tsx'
import {API_Message, ApiOutputMap} from './api'

export const ACCESS_TOKEN_LS_KEY = 'access_token'
export const REFRESH_TOKEN_LS_KEY = 'refresh_token'
export const USER_ID_LS_KEY = 'user_id'

export type Message = { id:string, isMine?:boolean, name: string, text: string, time: string }

function convertDateTime(input:string) {
  // Parse the input string to a Date object
  const date = new Date(input)

  if (isNaN(date.getTime())) return ''
  // Define an array of month names for formatting
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Extract the necessary components
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = months[date.getUTCMonth()]
  const year = `${date.getUTCFullYear()}`.replace(/^20/,'\'')

  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  // Format the date string as requested
  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`
}

export function chatPropsAdapter(v: ApiOutputMap['chats/GET']['results']): ChatProps[] {
  const r: ChatProps[] = []
  for (const vElement of v) {
    r.push({
      id: vElement.id,
      name: vElement.title ?? 'UNDEFINED',/*todo*/
      // count:/*todo*/0,
      // image:/*todo*/'',
      // image_attachment_alt:/*todo*/'',
      state:/*todo*/'unread',
      text: vElement.last_message?.text??'',
      time: convertDateTime(vElement.last_message?.created_at??'')
    })
  }
  return r
}



export function arrayAdapter<I,O>(array:I[],elementAdapter:(v:I)=>O): O[] {
  const r: O[] = []
  for (const el of array) {
    r.push(elementAdapter(el))
  }
  return r.reverse()
}

export function messageAdapter(v: API_Message): Message {
  return {
    id: v.id,
    isMine: v.sender.id===localStorage.getItem(USER_ID_LS_KEY),
    name: v.sender.username,
    text: v.text,
    time: convertDateTime(v.created_at)
  }
}

