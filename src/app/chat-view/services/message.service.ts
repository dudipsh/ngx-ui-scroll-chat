import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {delay, map} from 'rxjs/operators';
import {READ_MESSAGE_PAGINATION} from './chat.gql';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import {Message} from '../message';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  lastIndex: number;
  feedQuery: QueryRef<any>;
  channelId: string;

  cache: Map<number, Message>;
  newMessages$: Subject<Message[]>;


  MIN = 0;
  MAX = 2;
  DELAY_MS = 250;
  data: Message[] = [];

  constructor(
    private apollo: Apollo
  ) {
    this.lastIndex = -1;
    this.cache = new Map<number, Message>();


  }


  loadFirstBulk(channelId) {
    this.readMessage(channelId, 50, 0).subscribe((message: Message[]) => {
    });
  }


  // init the list //
  readMessage(channelId: string, first: number, skip: number) {
    this.feedQuery = this.apollo.watchQuery({
      query: READ_MESSAGE_PAGINATION,
      variables: {
        channelId,
        first,
        skip
      },
      fetchResults: true,
      fetchPolicy: 'network-only',
    });

    return this.feedQuery
      .valueChanges
      .pipe(map(({data}) => data))
      .pipe(map(({readMessageByChannelByDate}) => readMessageByChannelByDate));
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
    return forkJoin(of(result), this.fetchMoreMessages(channelId, _index, _count))
      .pipe(
        map(([cached, remote]) => {
          console.log(cached, remote);
          console.log(remote)
          // remote.forEach((item, i) => {
          //   this.cache.set(_index + i, item);
          //   this.lastIndex = Math.max(this.lastIndex, _index + i);
          // });
          return [...cached, ...remote.data.readMessageByChannelByDate];
        })
      );

  }

  // fetch more data when scrolled to first item // (top)
  fetchMoreMessages(channelId: string, first: number, skip: number) {
    if (!channelId) {
      return;
    }
    return this.feedQuery.fetchMore({
      variables: {
        channelId,
        first,
        skip
      },
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult || !prev) {
          return prev;
        }
        return of(Object.assign({}, prev, {
          readMessageByChannelByDate: [...prev.readMessageByChannelByDate, ...fetchMoreResult.readMessageByChannelByDate],
        }));
      },
    });
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
