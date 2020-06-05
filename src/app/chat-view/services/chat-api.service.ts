import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MessageServerResult} from './message-server-result';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {

  constructor(
    private http: HttpClient,
  ) {
  }


  public getMessages(page, limit) {
    const url = 'http://localhost:3000/message';
    return this.http.get(url, {params: {page, limit, channelId: '5eda510612472320c8cbc0bc'}}) as Observable<MessageServerResult>;


  }

}
