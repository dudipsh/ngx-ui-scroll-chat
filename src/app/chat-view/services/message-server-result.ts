import {Message} from '../message';

export class MessageServerResult {
  totalCount: number;
  page: number;
  channelId: string;
  limit: number
  data: Message[]
}
