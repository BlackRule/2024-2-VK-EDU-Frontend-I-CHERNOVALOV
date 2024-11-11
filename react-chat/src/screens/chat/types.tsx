import {Message} from '~/types.ts'

export type MessageWithIsNew = Message & { isNew?: boolean };
export type MessagesWithNeedsScroll = Message[] & { needsScroll?: boolean };