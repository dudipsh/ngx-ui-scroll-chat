import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {map, take} from 'rxjs/operators';
import {READ_MESSAGE_PAGINATION} from './chat.gql';
import {Subject} from 'rxjs';
import {Message} from './message';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  lastIndex: number;
  feedQuery: QueryRef<any>;
  newMessages$: Subject<Message[]>;
  channelId: string;

  constructor(
    private apollo: Apollo
  ) {
  }


  // init the list //
  readMessage(channelId: string, first: number, skip: number) {
    this.feedQuery = this.apollo.watchQuery({
      query: READ_MESSAGE_PAGINATION,
      variables: {
        channelId,
        first,
        skip
      },
      fetchResults: true,
      fetchPolicy: 'network-only',
    });

    return this.feedQuery
      .valueChanges
      .pipe(map(({data}) => data))
      .pipe(map(({readMessageByChannelByDate}) => readMessageByChannelByDate));
  }


  // fetch more data when scrolled to first item // (top)
  fetchMoreMessages(channelId: string, first: number, skip: number) {
    if (!channelId) {
      return;
    }
    return this.feedQuery.fetchMore({
      variables: {
        channelId,
        first,
        skip
      },
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult || !prev) {
          return prev;
        }
        return Object.assign({}, prev, {
          readMessageByChannelByDate: [...prev.readMessageByChannelByDate, ...fetchMoreResult.readMessageByChannelByDate],
        });
      },
    });
  }
}
