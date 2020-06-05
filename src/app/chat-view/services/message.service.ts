import {Injectable} from '@angular/core';
import {ChatApiService} from './chat-api.service';
import {Message} from '../message';
import {forkJoin, of} from 'rxjs';
import {map} from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class MessageService {
  lastIndex: number;
  cache: Map<number, Message>;
  totalItems = 1;
  MIN = 1;

  constructor(
    private chatApi: ChatApiService,
  ) {
    this.lastIndex = -1;
    this.cache = new Map<number, Message>();
  }


  readMessagesData(index, count) {
  //  looking for cached items
    if (index < 0) return of([])
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
    const _result = of(result);
    const _count = count - (_index - index);
    console.log('remote:', _index, _count);

    return forkJoin(_result, this.chatApi.getMessages(index, _count ))
      .pipe(
        map(([cached, remote]) => {
          console.log(cached, remote);
          remote.data.forEach((item, i) => {
            this.cache.set(_index + i, item);
            this.lastIndex = Math.max(this.lastIndex, _index + i);
          });
          this.totalItems = remote.totalCount;
          return [...cached, ...remote.data].reverse();
        })
      );
    // let data = [];
    // const start = Math.max(this.MIN, index);
    // const end = index + count - 1;
    // if (start <= end) {
    //   for (let i = start; i <= end; i++) {
    //     data = [...data, { _id: i, text: 'item #' + i }]
    //  //   data.unshift({ _id: i, text: 'item #' + i });
    //   }
    // }
    // return of(data);
  }
}
