import {Message} from '~/common.ts'

export type MessageWithIsNew = Message & { isNew?: boolean };
export type MessagesWithNeedsScroll = Message[] & { needsScroll?: boolean };