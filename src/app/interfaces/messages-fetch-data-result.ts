import {Message} from "./message";

export class MessagesFetchDataResult {
  channelId: string;
  totalCount: number;
  limit: number;
  page: number;
  order: string;
  data: Message[];
}
