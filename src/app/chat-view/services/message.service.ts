import {Injectable} from '@angular/core';
import {forkJoin, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {RemoteService} from './remote.service';

interface Item {
  id: number;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  lastIndex: number;
  cache: Map<number, any>;
  newMessages$: Subject<any[]>;

  constructor(private remoteService: RemoteService) {
    this.lastIndex = 0;
    this.cache = new Map<number, any>();
    this.newMessages$ = new Subject();
  }

  requestData(channelId, index: number, count: number) {
    // looking for cached items

    const result: any[] = [];
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

    // retrieve non-cached items
    const _result = of(result);
    const _count = count - (_index - index);
    console.log('remote:', _index, _count);
    return this.remoteService.retrieve(channelId, _index, _count)
    // return forkJoin(this.remoteService.retrieve(channelId, _index, _count))
    //   .pipe(
    //     map((remote) => {
    //       console.log('!!!!!!!!');
    //       console.log(remote);
    //
    //       remote.forEach((item, i) => {
    //         console.log(item);
    //         this.cache.set(_index + i, item);
    //         this.lastIndex = Math.max(this.lastIndex, _index + i);
    //       });
    //       return [...remote];
    //     })
    //   );


    // return forkJoin(of(result), this.remoteService.retrieve(channelId, count, index ))
    //   .pipe(
    //     map(([cached, remote]) => {
    //       console.log(cached, remote);
    //       remote.forEach((item, i) => {
    //         this.cache.set(_index + i, item);
    //         this.lastIndex = Math.max(this.lastIndex, _index + i);
    //         console.log(this.lastIndex)
    //       });
    //       return [...cached, ...remote];
    //     })
    //   );
  }

  // appendNewMessages(count: number) {
  //   this.remoteService.emulateNewMessages(count).subscribe(data => {
  //     data.forEach((item, i) => {
  //       this.lastIndex++;
  //       this.cache.set(this.lastIndex, item);
  //     });
  //     this.newMessages$.next(data);
  //   });
  // }
}
