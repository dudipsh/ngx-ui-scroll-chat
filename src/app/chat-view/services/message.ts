export class Message {
  // tslint:disable-next-line:variable-name
  _id: string;
  type: string;
  subType: 'message' | '';
  text: string;
  ts: string;
  updateAt: string;
  senderId: string;
  channelId: string;
}
