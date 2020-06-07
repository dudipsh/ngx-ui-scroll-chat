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


  // const channelId = '5edaa34844a52a4e8a2159d9' // Remote Channel
  // const channelId = '5eda510612472320c8cbc0bc' // Local Channel
  // const url = 'https://graphql.vdi.co.il/message';
  public getMessages(page, limit, channelId: string, orderBy: '-ts' | 'ts' | string): Observable<any> {
   // const url = 'http://localhost:3000/message';
    const url = 'https://graphql.vdi.co.il/message';
    // return this.http.get(
    //   url, {
    //     params: {page, limit, orderBy, channelId}
    //   });
    return this.http.get(`${url}?page=${page}&limit=${limit}&channelId=${channelId}&orderBy=${orderBy}`)
  }

}
