import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {Subject} from 'rxjs';
import {WebSocketLink} from 'apollo-link-ws';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';


const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here
const socketUri = 'ws://localhost:3000/graphql';
const errorSubject = new Subject<any>();
const getErrorSubject = () => errorSubject.asObservable();

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
  constructor(
    private apollo: Apollo, httpLink: HttpLink
  ) {
    const ws = new WebSocketLink({
      uri: socketUri,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: localStorage.getItem('authToken') || null
        }
      },
    });
    const http = httpLink.create({
      uri
    });
    const link = split(({query}) => {
      const {kind, operation}: any = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    }, ws, http);

    apollo.create({
      link,
      cache: new InMemoryCache({
        dataIdFromObject : (object) => object.id
      }),
    });

    getErrorSubject().subscribe((res) => {
      console.log(res);
    });

  }

}
