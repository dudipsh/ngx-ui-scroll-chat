import {Injectable} from '@angular/core';
import {READ_MESSAGE_PAGINATION} from './chat.gql';
import {Apollo} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {

  constructor(
    private apollo: Apollo
  ) {
  }


  readMessage(channelId: string, first: number, skip: number) {
    return this.apollo.watchQuery({
      query: READ_MESSAGE_PAGINATION,
      variables: {
        channelId,
        first,
        skip
      },
      fetchResults: true,
      fetchPolicy: 'network-only',
    });
  }

}
