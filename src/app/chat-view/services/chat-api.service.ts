import { Injectable } from '@angular/core';
import {READ_MESSAGE_PAGINATION} from './chat.gql';
import {delay, map} from 'rxjs/operators';
import {Apollo, QueryRef} from 'apollo-angular';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {

  constructor(
    private apollo: Apollo
  ) { }



  readMessage(channelId: string, first: number, skip: number) {
    return this.apollo.watchQuery({
      query: READ_MESSAGE_PAGINATION,
      variables: {
        channelId,
        first,
        skip
      },
      // fetchResults: true,
      // fetchPolicy: 'network-only',
    }).valueChanges
      .pipe(map(({data}) => data))
      .pipe(map(({readMessageByChannelByDate}) => readMessageByChannelByDate)) as Observable<any[]>;
  }


  fetchMoreMessages(
    queryRef: QueryRef<any>,
    channelId: string,
    first: number,
    skip: number,
    updateQuery: (prev, {fetchMoreResult}) => any | Observable<any>) {
    if (!channelId) {
      return;
    }
    return queryRef.fetchMore({
      variables: {
        channelId,
        first,
        skip
      },
      updateQuery
      //     (prev, {fetchMoreResult}) => {
      //     if (!fetchMoreResult || !prev) {
      //       return prev;
      //     }
      //     let data = [...prev.readMessageByChannelByDate, ...fetchMoreResult.readMessageByChannelByDate];
      //     const start = Math.max(this.MIN, first);
      //     const end = Math.min(first + skip - 1, this.MAX);
      //     if (start <= end) {
      //       data = this.data.slice(start, end + 1);
      //     }
      //     return this.DELAY_MS > 0 ? of(data).pipe(delay(this.DELAY_MS)) : of(data);
      //     // return Object.assign({}, prev, {
      //     //   readMessageByChannelByDate: [...prev.readMessageByChannelByDate, ...fetchMoreResult.readMessageByChannelByDate],
      //     // });
      //   },
      // });
    });
  }

}
