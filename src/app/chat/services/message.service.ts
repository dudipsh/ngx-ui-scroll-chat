import { Injectable } from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Message} from "../../interfaces/message";
import {ChatService} from "./chat.service";


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  lastIndex: number;
  onPush$: Subject<Message[]>;
  private cache: Map<number, Message>;

  constructor(
      private remoteService: ChatService,
  ) {
    this.lastIndex = -1;
    this.onPush$ = new Subject();
    this.cache = new Map<number, Message>();
  }

  initialize(channelId: string, page): Promise<boolean> {
    return new Promise(resolve => {
      // ask for initial existed messages
      this.remoteService.readMessagesInChannel(channelId, 0, 30, '-ts')
          .subscribe(({data , totalCount }) => {
            const size = data.length;
            this.remoteService.AMOUNT_INIT = totalCount;
            data.forEach((item, i) =>
                this.persist(totalCount - size + i, item)
            );
            // subscribe to new messages notifier
            this.remoteService.newData$
                .subscribe(items => {
                  items.forEach((item, i) =>
                      this.persist(this.lastIndex + 1, item)
                  );
                  this.onPush$.next(items);
                });
            resolve(true);
          });
    });
  }

  request(index: number, count: number): Observable<Message[]> {
    console.log(`requesting [${index}...${index + count}] items`);
    // try cache
    if (index < 0) return of([])
    const cached = this.takeFromCache(index, count);
    if (cached) {
      console.log(`taken from cache (${count})`);
      return of(cached);
    }
    // request
    return this.remoteService.retrieve(index, count)
        .pipe( // response caching
            tap(items => {
              console.log(`resolved (${items.length})`);
              items.forEach((item, i) =>
                  this.persist(index + i, item)
              );
            })
        );
  }

  private persist(index: number, item: Message) {
    this.cache.set(index, item);
    if (index > this.lastIndex) {
      this.lastIndex = index;
    }
  }

  private takeFromCache(index: number, count: number): null | Message[] {
    const cached: Message[] = [];
    for (let i = index; i < index + count; i++) {
      const item = this.cache.get(i);
      if (item) {
        cached.push(item);
      }
    }
    return cached.length === count ? cached : null;
  }
}
