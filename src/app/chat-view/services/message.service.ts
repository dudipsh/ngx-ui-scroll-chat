import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {delay, map} from 'rxjs/operators';
import {from, Observable, of, Subject} from 'rxjs';
import {Message} from '../message';
import {ChatApiService} from './chat-api.service';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  lastIndex = -1;
  queryRef: QueryRef<any>;
  channelId: string;

  cache: Map<number, Message>;
  newMessages$: Subject<Message[]>;


  MIN = 0;
  MAX = 2;
  DELAY_MS = 250;
  data: Message[] = [];

  constructor(
    private apollo: Apollo,
    private chatApiService: ChatApiService
  ) {
    this.lastIndex = -1;
    this.cache = new Map<number, Message>();


  }


  loadFirstBulk(channelId) {
    this.queryRef = this.chatApiService.readMessage(channelId, 1, 0);
    this.queryRef.valueChanges
      .pipe(map(({data}) => data))
      .pipe(map(({readMessageByChannelByDate}) => readMessageByChannelByDate))
      .subscribe((message: Message[]) => {
        this.data = message;
      });
  }

  requestData(channelId: string, index: number, count: number): Observable<Message[]> {
    // looking for cached items
    const result: Message[] = [];
    console.log('request:', index, count);
    let _index = null;
    for (let i = index; i < index + count; i++) {
      const item = this.cache.get(i);
      if (item) {
        result.push(item);
      } else {
        _index = i;
        break;
      }
    }
    if (_index === null) {
      return of(result);
    }

    // // retrieve non-cached items
    const _result = of(result);
    const _count = count - (_index - index);
    console.log(_count);
    // console.log('remote:', _index, _count);
    return from(this.chatApiService.fetchMoreMessages(this.queryRef, channelId, 50, index, (prev, {fetchMoreResult}) => {
      console.log(prev);
      console.log(fetchMoreResult);
      const result = [...prev.readMessageByChannelByDate, ...fetchMoreResult.readMessageByChannelByDate] as any[]
      return result
    })).pipe(map(({data}) => data))
      .pipe(map(({readMessageByChannelByDate}) => readMessageByChannelByDate)) as Observable<any>

  }


  retrieve(index: number, count: number): Observable<Message[]> {
    let data = [];
    const start = Math.max(this.MIN, index);
    const end = Math.min(index + count - 1, this.MAX);
    if (start <= end) {
      data = this.data.slice(start, end + 1);
    }

    return this.DELAY_MS > 0 ? of(data).pipe(delay(this.DELAY_MS)) : of(data);
  }
}
