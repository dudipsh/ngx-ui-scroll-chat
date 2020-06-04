import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {delay, take, tap, throttleTime} from 'rxjs/operators';
import {ChatApiService} from './chat-api.service';
import {Message} from '../message';



@Injectable({
  providedIn: 'root',
})
export class RemoteService {

  MIN = 0;
  MAX = 0;
  DELAY_MS = 250;
  data: any[] = [];

  constructor(
    private chatApiService: ChatApiService,
  ) {
  }

  generateMessage(index: number) {
    return {
      id: index,
      text: 'item #' + index + ' .'.repeat(Math.floor(Math.random() * (50 - 1 + 1) + 1))
    };
  }

  retrieve(channelId, index: number, count: number) {
    let data = [];
    const start = Math.max(this.MIN, index);
    const end = Math.min(index + count - 1, this.MAX);
    if (start <= end) {
      data = this.data.slice(start, end + 1);
    }
    const readData = this.chatApiService.readMessage(channelId, start, start + count);
    return this.DELAY_MS > 0 ? readData : of(data);
    // let data = [];
    // const start = Math.max(this.MIN, index);
    // const end = Math.min(index + count - 1, this.MAX);
    // if (start <= end) {
    //   data = this.data.slice(start, end + 1);
    // }
    // return this.DELAY_MS > 0 ? this.chatApiService.readMessage(channelId, start, this.data.length).pipe(take(1))  : of(data);
    // readMessage
    // return this.DELAY_MS > 0 ? of(data).pipe(delay(this.DELAY_MS)) : of(data);
    // return this.DELAY_MS > 0 ? this.chatApiService.readMessage(channelId, index, count) : of(data);
  }
}
