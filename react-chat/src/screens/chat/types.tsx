import {Message} from '@/types.ts'

export type MessageWithIsNew = Message & { isNew?: boolean };
export type ArrayOfMessagePropsWithNeedsScroll = Array<MessageWithIsNew> & { needsScroll?: boolean };