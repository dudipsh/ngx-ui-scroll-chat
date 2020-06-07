import {Injectable} from '@angular/core';
import {ChatApiService} from './chat-api.service';
import {Message} from '../message';
import {MessageServerResult} from './message-server-result';
import {of, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  cache: Map<number, Message>;

  allMessages: Message[] = [];
  setResult: MessageServerResult;

  constructor(
    private chatApi: ChatApiService,
  ) {
  }

}
