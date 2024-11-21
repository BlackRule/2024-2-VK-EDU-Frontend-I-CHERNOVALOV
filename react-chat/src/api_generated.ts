import {Static} from 'runtypes'
import * as rt from "runtypes";
import {assert,Equals} from "tsafe"
import {ApiInputMap, ApiOutputMap} from './api'

const Optional=(T)=>rt.Optional(T.Or(rt.Null))

const UserRt = rt.Record({
  id: rt.String,
  username: rt.String,
  first_name: rt.String,
  last_name: rt.String,
  bio: rt.String,
  avatar: Optional(rt.String),
  is_online: rt.Boolean,
  last_online_at: rt.String,
});

const ResultsRt = rt.Record({
  id: rt.String,
  text: rt.String,
  voice: rt.Null,
  sender: UserRt,
  chat: rt.String,
  files: rt.Array(rt.Never),
  updated_at: rt.Null,
  created_at: rt.String,
  was_read_by: rt.Array(rt.Never),
});






const Last_messageRt = rt.Record({
  id: rt.String,
  text: rt.String,
  voice: rt.Null,
  sender: UserRt,
  chat: rt.String,
  files: rt.Array(rt.Never),
  updated_at: rt.Null,
  created_at: rt.String,
  was_read_by: rt.Array(rt.Never),
});

const ResultsRtC = rt.Record({
  id: rt.String,
  title: rt.String,
  members: rt.Array(UserRt),
  creator: UserRt,
  avatar: rt.Null,
  created_at: rt.String,
  updated_at: rt.String,
  is_private: rt.Boolean,
  last_message: Last_messageRt,
});




const PagedResultsRt=(T)=> rt.Record({
  count: rt.Number,
  next: Optional(rt.String),
  previous: Optional(rt.String),
  results: rt.Array(T),
})
export const gen_ApiOutputMap = {
  'auth/POST': rt.Record({ refresh: rt.String, access: rt.String }),
  'centrifugo/connect/POST': rt.Record({ token: rt.String }),
  'centrifugo/subscribe/POST': rt.Record({ token: rt.String }),

  'chats/GET': PagedResultsRt(ResultsRtC),

  'messages/GET':PagedResultsRt(ResultsRt),

  'messages/POST':rt.Record({
  id: rt.String,
  text: rt.String,
  voice: Optional(rt.String),
  chat: rt.String,
  files: rt.Array(rt.Record({item: rt.String})),
  updated_at: Optional(rt.String),
  created_at: rt.String,
  was_read_by: rt.Array(UserRt),
  sender: UserRt,
}),
  'user/GET': rt.Record({
  id: rt.String,
  username: rt.String,
  first_name: rt.String,
  last_name: rt.String,
  bio: Optional(rt.String),
  avatar: Optional(rt.String),
  is_online: rt.Boolean,
  last_online_at: rt.String,
}),

}

type Gen_ApiOutputMap = {
  'auth/POST': Static<typeof gen_ApiOutputMap['auth/POST']>,
  'centrifugo/connect/POST': Static<typeof gen_ApiOutputMap['centrifugo/connect/POST']>,
  'centrifugo/subscribe/POST': Static<typeof gen_ApiOutputMap['centrifugo/subscribe/POST']>,
  'chats/GET': Static<typeof gen_ApiOutputMap['chats/GET']>,
  'messages/GET': Static<typeof gen_ApiOutputMap['messages/GET']>,
  'messages/POST': Static<typeof gen_ApiOutputMap['messages/POST']>,
  'user/GET': Static<typeof gen_ApiOutputMap['user/GET']>,

}

//Typechecking... Question to mentor: how to not copy paste here?
// got,expected E.g.:
// assert<Equals<ApiOutputMap['user/GET'], Gen_ApiOutputMap['user/GET']>>()
const tmp:Gen_ApiOutputMap['user/GET']={} as ApiOutputMap['user/GET']
const tmp1:Gen_ApiOutputMap['auth/POST']={} as ApiOutputMap['auth/POST']
const tmp2:Gen_ApiOutputMap['messages/POST']={} as ApiOutputMap['messages/POST']
const tmp3:Gen_ApiOutputMap['centrifugo/connect/POST']={} as ApiOutputMap['centrifugo/connect/POST']
const tmp4:Gen_ApiOutputMap['centrifugo/subscribe/POST']={} as ApiOutputMap['centrifugo/subscribe/POST']
const tmp5:Gen_ApiOutputMap['chats/GET']={} as ApiOutputMap['chats/GET']
const tmp6:Gen_ApiOutputMap['messages/GET']={} as ApiOutputMap['messages/GET']
const tmp7:Gen_ApiOutputMap['messages/POST']={} as ApiOutputMap['messages/POST']

