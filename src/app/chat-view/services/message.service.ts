import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {RemoteService} from './remote.service';
import {QueryRef} from 'apollo-angular';
import {ChatApiService} from './chat-api.service';

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

  public queryRef: QueryRef<any>;

  constructor(
    private chatApi: ChatApiService,
    private remoteService: RemoteService
  ) {
    this.lastIndex = 0;
    this.cache = new Map<number, any>();
    this.newMessages$ = new Subject();
  }

  requestData(channelId, index: number, count: number) {
    return this.chatApi.readMessage(channelId, count, index );
  }


  testFetchMore(queryRef: QueryRef<any>, channelId, index: number, count: number): Observable<any[]> {
    if (!queryRef || !channelId) return of([])
    this.fetchMoreMessages(queryRef, channelId, count, this.lastIndex, (prev, {fetchMoreResult}) => {
      this.lastIndex = count;
      if (prev && prev.readMessageByChannelByDate && fetchMoreResult && fetchMoreResult.readMessageByChannelByDate) {
        return   of([...prev.readMessageByChannelByDate, ...fetchMoreResult.readMessageByChannelByDate])
      }
    })
    return queryRef.valueChanges.pipe(map(({data}) => data))
      .pipe(map(({readMessageByChannelByDate}) => readMessageByChannelByDate))

  }



  private fetchMoreMessages(
    queryRef: QueryRef<any>,
    channelId: string,
    first: number,
    skip: number,
    updateQuery: (prev, {fetchMoreResult}) => any | Observable<any>) {
    if (!channelId) {
      return;
    }
    if (!queryRef) return of([])
    queryRef.fetchMore({
      variables: {
        channelId,
        first,
        skip
      },
      updateQuery
    });
  }
}
