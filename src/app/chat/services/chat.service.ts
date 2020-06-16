import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {Message} from '../../interfaces/message';
import {MessagesFetchDataResult} from '../../interfaces/messages-fetch-data-result';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url = 'https://graphql.vdi.co.il';

  AMOUNT = 999; // how many messages in the database (total)
  AMOUNT_INIT = 30; // how many messages will be sent on init
  LAST_INDEX = 30;
  DELAY_MS = 250; // latency
  data: Message[] = []; // database
  newData$ = new Subject<Message[]>(); // new messages notifier
  channelId: string;
  constructor(
      private http: HttpClient,
  ) { }


  readMessagesInChannel(channelId, page, limit, orderBy = '-ts') {
    this.channelId = channelId;
    return this.getMessages(channelId, page, limit, orderBy)
  }

  // limit = 30 ( Max item in api call )
  private getMessages(channelId, page, limit, orderBy = 'ts') {
    return this.http.get(`${this.url}/message`, {
      params: {
        channelId,
        page,
        limit,
        orderBy
      }
    }) as Observable<MessagesFetchDataResult>;
  }

  retrieve(index: number, count: number): Observable<Message[]> {
    const start = Math.max(0, index);
    const end = Math.min(index + count - 1, this.AMOUNT - 1);
    // if (start <= end) {
    // //  data = this.data.slice(start, end + 1);
    //   data =  this.getMessages(this.channelId, start, 10).pipe((map((serverData) => serverData.data)));
    // }
  //  return  this.DELAY_MS > 0 ? data.pipe(delay(this.DELAY_MS)) : of(data);
    return this.getMessages(this.channelId, index , 30).pipe((map((serverData) => serverData.data)))
  }

  // emulation of two-way interaction with client
  emulateNewMessages(count: number) {
    const data = [];
    for (let i = this.AMOUNT; i < this.AMOUNT + count; i++) {
      data.push(this.data[i]);
    }
    this.data.push(...data);
    // this.AMOUNT += count;
    if (this.DELAY_MS) {
      setTimeout(() => this.newData$.next(data), this.DELAY_MS);
    } else {
      this.newData$.next(data);
    }
  }
}
