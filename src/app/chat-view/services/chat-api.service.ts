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


  public getMessages(page, limit, orderBy: '-ts' | 'ts') {
    //const url = 'http://localhost:3000/message';
    // const channelId = '5edaa34844a52a4e8a2159d9' // Remove Channel
   // const channelId = '5eda510612472320c8cbc0bc' // Local Channel
    const url = 'https://graphql.vdi.co.il/message';
    return this.http.get(url, {params: {page, limit, orderBy, channelId: '5edaa34844a52a4e8a2159d9'}}) as Observable<MessageServerResult>;
  }

}
