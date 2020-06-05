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
    const url = 'http://graphql.vdi.co.il/message'
   // const url = 'http://localhost:3000/message';
    return this.http.get(url, {params: {page, limit, channelId: '5edaa34844a52a4e8a2159d9'}}) as Observable<MessageServerResult>;


  }

}
