import * as rt from 'runtypes'


export const FileRt = rt.Record({item: rt.String})

const Nullable=(T:rt.Runtype)=>T.Or(rt.Null)

const UserRt = rt.Record({
  avatar: Nullable(rt.String),
  bio: Nullable(rt.String),
  first_name: rt.String,
  id: rt.String,
  is_online: rt.Boolean,
  last_name: rt.String,
  last_online_at: rt.String,
  username: rt.String,
})

const MessageRt = rt.Record({
  chat: rt.String,
  created_at: rt.String,
  files: rt.Array(FileRt),
  id: rt.String,
  sender: UserRt,
  updated_at: rt.Null.Or(rt.String),
  was_read_by: rt.Null.Or(rt.Array(UserRt)),
}).And(rt.Record({
  text: rt.String,
  voice: rt.Null,
}).Or(rt.Record({
  text: rt.Null,
  voice: rt.String,
})))

const PagedResultsRt=<T>(Rt:rt.Runtype<T>)=> rt.Record({
  count: rt.Number,
  next: Nullable(rt.String),
  previous: Nullable(rt.String),
  results: rt.Array(Rt),
})
const ChatRt = rt.Record({
  avatar: Nullable(rt.String),
  created_at: rt.String,
  creator: UserRt,
  id: rt.String,
  is_private: rt.Boolean,
  last_message: MessageRt,
  members: rt.Array(UserRt),
  title: rt.String,
  updated_at: rt.String,
})
export const gen_ApiOutputMap = {
  'auth/POST': rt.Record({ access: rt.String, refresh: rt.String }),
  'centrifugo/connect/POST': rt.Record({ token: rt.String }),
  'centrifugo/subscribe/POST': rt.Record({ token: rt.String }),
  'chats/GET': PagedResultsRt(ChatRt),
  'messages/GET':PagedResultsRt(MessageRt),
  'messages/POST':rt.Record({
    chat: rt.String,
    created_at: rt.String,
    files: rt.Array(FileRt),
    id: rt.String,
    sender: UserRt,
    text: rt.String,
    updated_at: Nullable(rt.String),
    voice: Nullable(rt.String),
    was_read_by: rt.Array(UserRt),
  }),
  'user/GET': rt.Record({
    avatar: Nullable(rt.String),
    bio: Nullable(rt.String),
    first_name: rt.String,
    id: rt.String,
    is_online: rt.Boolean,
    last_name: rt.String,
    last_online_at: rt.String,
    username: rt.String,
  }),
}